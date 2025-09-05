const Job = require('../models/Job');   
// GET /api/jobs  → all jobs (for seekers)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ postedAt: -1 })
      .populate('employer', 'name email');
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// GET /api/jobs/mine  → employer's own jobs
exports.getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can view their jobs' });
    }
    const jobs = await Job.find({ employer: req.user.id }).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching my jobs:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// POST /api/jobs  → create job (employer only)
exports.postJob = async (req, res) => {
  try {
    const { title, description, company, location } = req.body;

    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can post jobs' });
    }

    const job = new Job({
      title,
      description,
      company,
      location,
      employer: req.user.id
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (err) {
    console.error('Error posting job:', err);
    res.status(500).json({ error: 'Failed to post job' });
  }
};

// PUT /api/jobs/:id  → update a job (employer only, must own it)
exports.updateJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can edit jobs' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not your job' });
    }

    const allowed = ['title', 'description', 'company', 'location', 'status'];
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) job[k] = req.body[k];
    });

    await job.save();
    res.json({ message: 'Job updated', job });
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

// DELETE /api/jobs/:id  → delete a job (employer only, must own it)
exports.deleteJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can delete jobs' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not your job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

// POST /api/jobs/:id/apply  → seeker applies
exports.applyJob = async (req, res) => {
  try {
    const { coverLetter = '' } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const already = job.applicants.some(
      (a) => a.user && a.user.toString() === req.user.id
    );
    if (already) {
      return res.status(400).json({ error: 'You already applied to this job' });
    }

    job.applicants.push({ user: req.user.id, coverLetter });
    await job.save();

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Error applying for job:', err);
    res.status(500).json({ error: 'Failed to apply for job' });
  }
};
