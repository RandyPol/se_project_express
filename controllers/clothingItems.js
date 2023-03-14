const ClothingItem = require('../models/clothingItem')
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors')

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => {
      res.send(clothingItems)
    })
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }))
}

module.exports.createClothingItem = async (req, res) => {
  const { _id } = req.user
  const { name, weather, imageUrl } = req.body
  try {
    const clothingItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: _id,
    })
    res.status(201).send(clothingItem)
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: error.message })
    } else if (error.statusCode === NOT_FOUND) {
      res.status(NOT_FOUND).send({ message: error.message })
    } else {
      res
        .status(SERVER_ERROR)
        .send({ message: error.message || 'internal server error' })
    }
  }
}

/**
 *
 * Below will be the controllers for individual clothing items functionality
 */
module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params
  ClothingItem.findByIdAndRemove(itemId)
    .orFail(() => {
      const error = new Error('Clothing ID not found')
      error.statusCode = NOT_FOUND
      throw error
    })
    .then((clothingItem) => {
      res.send(clothingItem)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid clothes id' })
      } else if (err.statusCode === NOT_FOUND) {
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
      res.send(clothingItem)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid clothes id' })
      } else if (err.statusCode === NOT_FOUND) {
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
      res.send(clothingItem)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid clothes id' })
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message })
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: err.message || 'internal server error' })
      }
    })
}
