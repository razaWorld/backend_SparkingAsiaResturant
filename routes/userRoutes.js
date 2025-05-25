const express = require('express');
const { createUser, getUsers,loginUser} = require('../controllers/userController');
const { loginRateLimiter } = require('../middleware/rateLimiter'); // Import the rate limiter


const router = express.Router();

router.post('/create_user', createUser);
router.post('/login',loginRateLimiter,loginUser)
router.get('/get_all_users', getUsers);

module.exports = router;
