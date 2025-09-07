// server/controllers/applicationController.js
const Application = require('../models/Application');

// Get applications of logged-in user (job seeker)
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ applicant: userId })
      .populate('job', 'title company location')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
