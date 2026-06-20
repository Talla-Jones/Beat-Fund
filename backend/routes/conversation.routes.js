const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const auth = require('../middleware/auth');

router.post('/', auth, conversationController.getOrCreateConversation);
router.get('/', auth, conversationController.getUserConversations);

module.exports = router;