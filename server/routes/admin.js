const express = require('express');
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Donation = require('../models/Donation');
const BloodRequest = require('../models/BloodRequest');
const BloodInventory = require('../models/BloodInventory');
const BloodCamp = require('../models/BloodCamp');
const CampRegistration = require('../models/CampRegistration');

const router = express.Router();

router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const inventory = await BloodInventory.find();
    const totalBloodUnits = inventory.reduce((sum, item) => sum + item.availableUnits, 0);
    const pendingRequests = await BloodRequest.countDocuments({ status: 'pending' });
    const totalDonations = await Donation.countDocuments({ status: 'approved' });
    const upcomingCamps = await BloodCamp.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(5);
    const totalUsers = await User.countDocuments();
    const totalRequests = await BloodRequest.countDocuments();

    const inventoryByGroup = inventory.map((item) => ({
      bloodGroup: item.bloodGroup,
      availableUnits: item.availableUnits,
      reservedUnits: item.reservedUnits,
    }));

    const donationsByStatus = {
      pending: await Donation.countDocuments({ status: 'pending' }),
      approved: await Donation.countDocuments({ status: 'approved' }),
      rejected: await Donation.countDocuments({ status: 'rejected' }),
    };

    const requestsByStatus = {
      pending: await BloodRequest.countDocuments({ status: 'pending' }),
      approved: await BloodRequest.countDocuments({ status: 'approved' }),
      fulfilled: await BloodRequest.countDocuments({ status: 'fulfilled' }),
      rejected: await BloodRequest.countDocuments({ status: 'rejected' }),
    };

    res.json({
      totalDonors,
      totalBloodUnits,
      pendingRequests,
      totalDonations,
      upcomingCamps,
      totalUsers,
      totalRequests,
      inventoryByGroup,
      donationsByStatus,
      requestsByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/donors', protect, admin, async (req, res) => {
  try {
    const donors = await Donor.find().populate('userId', 'email role').sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/requests', protect, admin, async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/donations', protect, admin, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 }).populate('donorId', 'name bloodGroup phone');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/camps', protect, admin, async (req, res) => {
  try {
    const camps = await BloodCamp.find().sort({ date: 1 });
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/camps/:id/registrations', protect, admin, async (req, res) => {
  try {
    const registrations = await CampRegistration.find({ campId: req.params.id });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/donors/:id', protect, admin, async (req, res) => {
  try {
    const { name, phone, bloodGroup, dateOfBirth, gender, city, address } = req.body;
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
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
