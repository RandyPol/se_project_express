const rateLimit = require('express-rate-limit')

// Seting up the rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
})

module.exports = limiter
