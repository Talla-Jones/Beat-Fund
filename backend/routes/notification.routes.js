const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const auth = require('../middleware/auth');

router.get('/', auth, notificationController.getUserNotifications);
router.post('/', auth, notificationController.createNotification); // Mostly for internal use
router.put('/:id/read', auth, notificationController.markAsRead);

module.exports = router;