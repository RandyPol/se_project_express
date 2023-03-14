const router = require('express').Router()
const { NOT_FOUND } = require('../utils/errors')
// Import the routes
const userRoutes = require('./users')
const clothingItemRoutes = require('./clothingItems')

// Implement the routes
router.use('/users', userRoutes)
router.use('/items', clothingItemRoutes)

// Non-existent resources
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: 'Requested resource not found' })
})

module.exports = router
