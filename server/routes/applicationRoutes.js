const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// Apply for a job
router.post('/', auth, applicationController.applyJob);

// Get logged-in user applications
router.get('/my-applications', auth, applicationController.getUserApplications);

module.exports = router;
