// routes/users.js
const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.route('/profile')
  .get(auth, getUserProfile)
  .put(auth, updateUserProfile);

module.exports = router;