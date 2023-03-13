const router = require('express').Router()

// Import the routes
const userRoutes = require('./users')
const clothingItemRoutes = require('./clothingItems')
const likeRoutes = require('./likes')

// Implement the routes
router.use('/users', userRoutes)
router.use('/clothingItems', clothingItemRoutes)
router.use('/items', likeRoutes)

// Non-existent resources
router.use((req, res) => {
  res.status(404).json({ message: 'Requested resource not found' })
})

module.exports = router
