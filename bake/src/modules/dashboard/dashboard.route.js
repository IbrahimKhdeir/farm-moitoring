const express = require('express');
const router = express.Router();
const { getStats, getNotifications } = require('./dashboard.controller');
const authenticate = require('../../middleware/auth.middleware');

// Mount at /dashboard/stats - requires authentication
router.get('/dashboard/stats', authenticate, getStats);
// Mount at /notifications - requires authentication
router.get('/notifications', authenticate, getNotifications);

module.exports = router;
