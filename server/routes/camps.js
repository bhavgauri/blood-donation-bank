const express = require('express');
const { protect, admin } = require('../middleware/auth');
const BloodCamp = require('../models/BloodCamp');
const CampRegistration = require('../models/CampRegistration');
const Donor = require('../models/Donor');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const camps = await BloodCamp.find().sort({ date: 1 });
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, date, time, location, organizer, totalSlots, description } = req.body;
    if (!name || !date || !time || !location || !organizer || !totalSlots) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const camp = await BloodCamp.create({ name, date, time, location, organizer, totalSlots, description: description || '' });
    res.status(201).json(camp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, date, time, location, organizer, totalSlots, description } = req.body;
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }
    if (name) camp.name = name;
    if (date) camp.date = date;
    if (time) camp.time = time;
    if (location) camp.location = location;
    if (organizer) camp.organizer = organizer;
    if (totalSlots) camp.totalSlots = totalSlots;
    if (description !== undefined) camp.description = description;
    await camp.save();
    res.json(camp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }
    await CampRegistration.deleteMany({ campId: camp._id });
    await camp.deleteOne();
    res.json({ message: 'Camp deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/register', protect, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }
    if (camp.registeredCount >= camp.totalSlots) {
      return res.status(400).json({ message: 'Camp is full' });
    }
    const existingReg = await CampRegistration.findOne({ campId: camp._id, userId: req.user._id });
    if (existingReg) {
      return res.status(400).json({ message: 'You are already registered for this camp' });
    }
    const donor = await Donor.findOne({ userId: req.user._id });
    const registration = await CampRegistration.create({
      campId: camp._id,
      userId: req.user._id,
      userName: req.user.name,
      phone: req.user.phone,
      bloodGroup: donor ? donor.bloodGroup : undefined,
    });
    camp.registeredCount += 1;
    await camp.save();
    res.status(201).json({ message: 'Successfully registered for camp', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
