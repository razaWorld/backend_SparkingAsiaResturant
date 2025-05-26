const express = require('express');
const { createUser,loginUser} = require('../controllers/userController');
const { loginRateLimiter } = require('../middleware/rateLimiter'); // Import the rate limiter


const router = express.Router();

router.post('/create_user', createUser);
router.post('/login',loginRateLimiter,loginUser)

module.exports = router;
