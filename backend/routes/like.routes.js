const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const auth = require('../middleware/auth');

router.post('/', auth, likeController.likeProject);
router.get('/:project_id', likeController.getProjectLikes);

module.exports = router;