const mongoose = require('mongoose');

const bloodCampSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    organizer: { type: String, required: true, trim: true },
    totalSlots: { type: Number, required: true, min: 1 },
    registeredCount: { type: Number, default: 0, min: 0 },
    description: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

bloodCampSchema.virtual('availableSlots').get(function () {
  return Math.max(0, this.totalSlots - this.registeredCount);
});

bloodCampSchema.set('toJSON', { virtuals: true });
bloodCampSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('BloodCamp', bloodCampSchema);
