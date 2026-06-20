const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const auth = require('../middleware/auth');

router.post('/', auth, commentController.createComment);
router.get('/:project_id', commentController.getProjectComments);

module.exports = router;