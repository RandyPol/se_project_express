const router = require('express').Router()

// Import the routes
const userRoutes = require('./users')
const clothingItemRoutes = require('./clothingItems')

// Implement the routes
router.use('/users', userRoutes)
router.use('/clothingItems', clothingItemRoutes)

// Non-existent resources
router.use((req, res) => {
  res.status(404).json({ message: 'Requested resource not found' })
})

module.exports = router
