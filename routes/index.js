const router = require('express').Router()
const { NOT_FOUND } = require('../utils/errorsCode')
// Import the routes
const userRoutes = require('./users')
const clothingItemRoutes = require('./clothingItems')
const { createUser, login } = require('../controllers/users')
const { auth } = require('../middlewares/auth')

// Import the validation functions
const {
  validateUserInfoBody,
  validateLoginBody,
} = require('../middlewares/validation')

// Sign up and sign in routes
router.post('/signin', validateLoginBody, login)
router.post('/signup', validateUserInfoBody, createUser)

// Implement the routes
router.use('/users', auth, userRoutes)
router.use('/items', clothingItemRoutes)

// Non-existent resources
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: 'Requested resource not found' })
})

module.exports = router
