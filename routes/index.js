const router = require('express').Router()
const userRoutes = require('./users')
const clothingItemRoutes = require('./clothingItems')
const { createUser, login } = require('../controllers/users')
const { auth } = require('../middlewares/auth')
const NotFoundError = require('../utils/errors/NotFoundError')


const {
  validateUserInfoBody,
  validateLoginBody,
} = require('../middlewares/validation')


router.post('/signin', validateLoginBody, login)
router.post('/signup', validateUserInfoBody, createUser)


router.use('/users', auth, userRoutes)
router.use('/items', clothingItemRoutes)


router.use(() => {
  throw new NotFoundError('Requested resource not found')
})

module.exports = router
