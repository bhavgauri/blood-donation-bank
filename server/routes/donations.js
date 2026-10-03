const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const BloodInventory = require('../models/BloodInventory');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { donationDate, location, bloodBank, notes } = req.body;
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }
    const donation = await Donation.create({
      donorId: donor._id,
      donorName: donor.name,
      bloodGroup: donor.bloodGroup,
      donationDate: donationDate || Date.now(),
      location: location || 'LifeLink Central Blood Bank',
      bloodBank: bloodBank || 'LifeLink Central Blood Bank',
      notes: notes || '',
      status: 'pending',
    });
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let donations;
    if (req.user.role === 'admin') {
      donations = await Donation.find().sort({ createdAt: -1 }).populate('donorId', 'name bloodGroup');
    } else {
      const donor = await Donor.findOne({ userId: req.user._id });
      if (!donor) {
        return res.json([]);
      }
      donations = await Donation.find({ donorId: donor._id }).sort({ donationDate: -1 });
    }
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donorId');
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    const oldStatus = donation.status;
    donation.status = status;
    await donation.save();

    if (status === 'approved' && oldStatus !== 'approved') {
      const inventory = await BloodInventory.findOne({ bloodGroup: donation.bloodGroup });
      if (inventory) {
        inventory.availableUnits += donation.units;
        await inventory.save();
      }
      const donor = await Donor.findById(donation.donorId);
      if (donor) {
        donor.lastDonationDate = donation.donationDate;
        donor.donationCount += 1;
        await donor.save();
      }
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
