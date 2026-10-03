const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: '' },
    lastDonationDate: { type: Date, default: null },
    donationCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donor', donorSchema);
