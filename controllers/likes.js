const ClothingItem = require('../models/clothingItem')
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors')

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
