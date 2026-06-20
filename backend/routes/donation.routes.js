const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller');
const auth = require('../middleware/auth');

router.post('/', auth, donationController.createDonation);
router.get('/:project_id', donationController.getProjectDonations);

module.exports = router;