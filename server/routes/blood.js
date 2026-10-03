const express = require('express');
const { protect, admin } = require('../middleware/auth');
const BloodInventory = require('../models/BloodInventory');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const query = {};
    if (city) {
      query.location = { $regex: city, $options: 'i' };
    }
    const inventory = await BloodInventory.find(query).sort({ bloodGroup: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:group', async (req, res) => {
  try {
    const inventory = await BloodInventory.findOne({ bloodGroup: req.params.group });
    if (!inventory) {
      return res.status(404).json({ message: 'Blood group not found' });
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:group', protect, admin, async (req, res) => {
  try {
    const { availableUnits, reservedUnits, bloodBank, location, contact } = req.body;
    const inventory = await BloodInventory.findOne({ bloodGroup: req.params.group });
    if (!inventory) {
      return res.status(404).json({ message: 'Blood group not found' });
    }
    if (availableUnits !== undefined) inventory.availableUnits = availableUnits;
    if (reservedUnits !== undefined) inventory.reservedUnits = reservedUnits;
    if (bloodBank !== undefined) inventory.bloodBank = bloodBank;
    if (location !== undefined) inventory.location = location;
    if (contact !== undefined) inventory.contact = contact;
    await inventory.save();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
