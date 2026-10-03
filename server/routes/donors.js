const express = require('express');
const { protect } = require('../middleware/auth');
const Donor = require('../models/Donor');
const Donation = require('../models/Donation');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id }).populate('userId', 'name email phone role');
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }
    const donations = await Donation.find({ donorId: donor._id }).sort({ donationDate: -1 });
    res.json({ donor, donations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    const { name, phone, bloodGroup, dateOfBirth, gender, city, address } = req.body;
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }
    if (name) donor.name = name;
    if (phone) donor.phone = phone;
    if (bloodGroup) donor.bloodGroup = bloodGroup;
    if (dateOfBirth) donor.dateOfBirth = dateOfBirth;
    if (gender) donor.gender = gender;
    if (city) donor.city = city;
    if (address !== undefined) donor.address = address;
    await donor.save();
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
