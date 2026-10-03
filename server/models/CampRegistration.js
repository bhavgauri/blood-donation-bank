const mongoose = require('mongoose');

const campRegistrationSchema = new mongoose.Schema(
  {
    campId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodCamp', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
  },
  { timestamps: true }
);

campRegistrationSchema.index({ campId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CampRegistration', campRegistrationSchema);
