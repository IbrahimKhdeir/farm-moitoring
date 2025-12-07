// src/modules/alerts/alerts.route.js
const express = require('express');
const router = express.Router();
const { listAlerts, markAsRead, getUnreadCount } = require('./alerts.controller');
const authenticate = require('../../middleware/auth.middleware');

router.get('/', authenticate, listAlerts);
router.put('/:id/read', authenticate, markAsRead);
router.get('/unread-count', authenticate, getUnreadCount);

module.exports = router;
