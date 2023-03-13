const ClothingItem = require('../models/clothingItem')
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors')

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => res.send({ data: clothingItems }))
    .catch((err) => res.status(500).send({ message: err.message }))
}

module.exports.createClothingItem = (req, res) => {
  const { _id } = req.user
  const { name, weather, imageUrl } = req.body
  ClothingItem.create({ name, weather, imageUrl, owner: _id })
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => res.status(500).send({ message: err.message }))
}

module.exports.deleteClothingItem = (req, res) => {
  const { clothingItemId } = req.params
  ClothingItem.findByIdAndRemove(clothingItemId)
    .orFail(() => {
      const error = new Error('Clothing ID not found')
      error.statusCode = NOT_FOUND
      throw error
    })
    .then((clothingItem) => {
      if (!clothingItem) {
        return res.status(404).send({ message: 'Clothing item not found' })
      }
      return res.send({ data: clothingItem })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid clothes id' })
      } else if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: err.message })
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: err.message || 'internal server error' })
      }
    })
}

module.exports.likeItem = (req, res) => {
  const { itemId } = req.params
  const { _id } = req.user
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: _id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Clothing ID not found')
      error.statusCode = NOT_FOUND
      throw error
    })
    .then((clothingItem) => {
      res.send({ data: clothingItem })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid clothes id' })
      } else if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: err.message })
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: err.message || 'internal server error' })
      }
    })
}

module.exports.dislikeItem = (req, res) => {
  const { itemId } = req.params
  const { _id } = req.user
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: _id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Clothing ID not found')
      error.statusCode = NOT_FOUND
      throw error
    })
    .then((clothingItem) => {
      res.send({ data: clothingItem })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid clothes id' })
      } else if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: err.message })
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: err.message || 'internal server error' })
      }
    })
}
