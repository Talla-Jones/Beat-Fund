const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth');

router.post('/', auth, messageController.sendMessage);
router.get('/:conversation_id', auth, messageController.getMessages);

module.exports = router;