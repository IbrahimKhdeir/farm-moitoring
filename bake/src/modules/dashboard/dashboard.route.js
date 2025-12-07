const express = require('express');
const router = express.Router();
const { getStats, getNotifications } = require('./dashboard.controller');

// Mount at /dashboard/stats
router.get('/dashboard/stats', getStats);
// Mount at /notifications
router.get('/notifications', getNotifications);

module.exports = router;
