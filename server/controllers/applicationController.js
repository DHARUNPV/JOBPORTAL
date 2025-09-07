const Application = require('../models/Application');

// Apply for a job
exports.applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    if (!jobId || !coverLetter) {
      return res.status(400).json({ message: 'Job ID and cover letter are required' });
    }

    // Check if already applied
    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      coverLetter
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error("❌ Error applying:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get applications of logged-in user
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ applicant: userId })
      .populate('job', 'title company location')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};
