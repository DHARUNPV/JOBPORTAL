const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Open', 'Filled'], default: 'Open' },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        coverLetter: { type: String, default: '' },
        appliedAt: { type: Date, default: Date.now }
      }
    ],
    postedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
