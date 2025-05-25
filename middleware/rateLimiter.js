const rateLimit = require('express-rate-limit');

// Create rate limiter for login attempts
const loginRateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 login attempts per 15 minutes
  message: 'Too many login attempts from this IP, please try again after 2 minutes.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

module.exports = {
  loginRateLimiter,
};
