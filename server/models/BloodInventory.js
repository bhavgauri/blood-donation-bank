const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      required: true,
      unique: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    availableUnits: { type: Number, default: 0, min: 0 },
    reservedUnits: { type: Number, default: 0, min: 0 },
    bloodBank: { type: String, default: 'LifeLink Central Blood Bank', trim: true },
    location: { type: String, default: 'Main Facility', trim: true },
    contact: { type: String, default: '+1-800-LIFELINK', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);
