const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const auth = require('../middleware/auth');

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

// Protected route
router.post('/', auth, projectController.createProject);

module.exports = router;