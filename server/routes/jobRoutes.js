const express = require('express');
const router = express.Router();
const {
  getJobs,
  getMyJobs,
  postJob,
  updateJob,
  deleteJob,
  applyJob
} = require('../controllers/jobController');
const auth = require('../middleware/auth');

// Get all jobs (public or seekers)
router.get('/', getJobs);

// Get jobs posted by the logged-in employer
router.get('/mine', auth, getMyJobs);

// Post a new job (employers only)
router.post('/', auth, postJob);

// Update a job (employer only, must own it)
router.put('/:id', auth, updateJob);

// Delete a job (employer only, must own it)
router.delete('/:id', auth, deleteJob);

// Apply to a job (seekers only)
router.post('/:id/apply', auth, applyJob);

module.exports = router;
