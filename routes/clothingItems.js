const router = require('express').Router()
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems')
const { auth } = require('../middlewares/auth')

const { validateCardBody, validateId } = require('../middlewares/validation')

router.get('/', getClothingItems)
router.post('/', validateCardBody, auth, createClothingItem)
router.delete('/:itemId', validateId, auth, deleteClothingItem)
router.put('/:itemId/likes', validateId, auth, likeItem)
router.delete('/:itemId/likes', validateId, auth, dislikeItem)

module.exports = router
