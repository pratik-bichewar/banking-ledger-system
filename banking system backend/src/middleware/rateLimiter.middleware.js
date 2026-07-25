const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for login route.
 * Allows max 5 login attempts per IP per 15 minutes.
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.',
    },
    skipSuccessfulRequests: true, // Don't count successful logins against the limit
});

/**
 * Rate limiter for register route.
 * Allows max 10 registration attempts per IP per hour.
 */
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many accounts created from this IP. Please try again after an hour.',
    },
});

module.exports = { loginLimiter, registerLimiter };
