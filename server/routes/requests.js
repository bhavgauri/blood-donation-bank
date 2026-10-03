const express = require('express');
const { protect, admin } = require('../middleware/auth');
const BloodRequest = require('../models/BloodRequest');
const BloodInventory = require('../models/BloodInventory');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { patientName, bloodGroup, requiredUnits, hospital, city, contactNumber, urgency, requiredDate, notes } = req.body;
    if (!patientName || !bloodGroup || !requiredUnits || !hospital || !city || !contactNumber || !requiredDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const bloodRequest = await BloodRequest.create({
      patientName,
      bloodGroup,
      requiredUnits,
      hospital,
      city,
      contactNumber,
      urgency: urgency || 'medium',
      requiredDate,
      notes: notes || '',
      requestedBy: req.user._id,
    });
    res.status(201).json(bloodRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'admin') {
      requests = await BloodRequest.find().sort({ createdAt: -1 });
    } else {
      requests = await BloodRequest.find({ requestedBy: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id);
    if (!bloodRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(bloodRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const bloodRequest = await BloodRequest.findById(req.params.id);
    if (!bloodRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    bloodRequest.status = status;
    await bloodRequest.save();

    if (status === 'fulfilled') {
      const inventory = await BloodInventory.findOne({ bloodGroup: bloodRequest.bloodGroup });
      if (inventory) {
        inventory.availableUnits = Math.max(0, inventory.availableUnits - bloodRequest.requiredUnits);
        await inventory.save();
      }
    }

    res.json(bloodRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
