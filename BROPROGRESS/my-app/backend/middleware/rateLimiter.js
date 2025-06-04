const rateLimit = require('express-rate-limit');

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Auth routes limiter (more strict)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again after an hour.'
});

// Goal creation limiter
const goalCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 goal creations per hour
  message: 'Too many goals created, please try again later.'
});

// Attribute update limiter
const attributeUpdateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 attribute updates per hour
  message: 'Too many attribute updates, please try again later.'
});

module.exports = {
  apiLimiter,
  authLimiter,
  goalCreationLimiter,
  attributeUpdateLimiter
}; 