// server/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// Protected route to get logged-in user applications
router.get('/my-applications', auth, applicationController.getUserApplications);

module.exports = router;
