const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
    donorName: { type: String, required: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    donationDate: { type: Date, required: true, default: Date.now },
    location: { type: String, required: true, trim: true },
    bloodBank: { type: String, default: 'LifeLink Central Blood Bank', trim: true },
    units: { type: Number, default: 1, min: 1 },
    notes: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
