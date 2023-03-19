const ClothingItem = require('../models/clothingItem')
const errorCode = require('../utils/errors')

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => {
      res.send(clothingItems)
    })
    .catch(() =>
      res
        .status(errorCode.SERVER_ERROR)
        .send({ message: 'Internal server error' })
    )
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
      res.status(errorCode.BAD_REQUEST).send({ message: 'Invalid data' })
    } else {
      res
        .status(errorCode.SERVER_ERROR)
        .send({ message: 'Internal server error' })
    }
  }
}

/**
 *
 * Below will be the controllers for individual clothing items functionality
 */
module.exports.deleteClothingItem = async (req, res) => {
  const { itemId } = req.params
  const { _id } = req.user
  try {
    const clothingItem = await ClothingItem.findById(itemId).orFail(() => {
      const error = new Error('Clothing ID not found')
      error.statusCode = errorCode.NOT_FOUND
      throw error
    })

    if (clothingItem.owner.toString() !== _id) {
      throw new errorCode.ForbiddenError()
    }

    await clothingItem.findByIdAndRemove(itemId)

    res.status(204).send(clothingItem)
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(errorCode.BAD_REQUEST).send({ message: 'Invalid clothes id' })
    } else if (err.statusCode === errorCode.NOT_FOUND) {
      res.status(errorCode.NOT_FOUND).send({ message: err.message })
    } else if (err.statusCode === errorCode.UNAUTHORIZED_ERROR) {
      res.status(errorCode.UNAUTHORIZED_ERROR).send({ message: err.message })
    } else {
      res
        .status(errorCode.SERVER_ERROR)
        .send({ message: 'Internal server error' })
    }
  }
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
      error.statusCode = errorCode.NOT_FOUND
      throw error
    })
    .then((clothingItem) => {
      res.send(clothingItem)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(errorCode.BAD_REQUEST)
          .send({ message: 'Invalid clothes id' })
      } else if (err.statusCode === errorCode.NOT_FOUND) {
        res.status(errorCode.NOT_FOUND).send({ message: err.message })
      } else {
        res
          .status(errorCode.SERVER_ERROR)
          .send({ message: 'Internal server error' })
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
      error.statusCode = errorCode.NOT_FOUND
      throw error
    })
    .then((clothingItem) => {
      res.send(clothingItem)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(errorCode.BAD_REQUEST)
          .send({ message: 'Invalid clothes id' })
      } else if (err.statusCode === errorCode.NOT_FOUND) {
        res.status(errorCode.NOT_FOUND).send({ message: err.message })
      } else {
        res
          .status(errorCode.SERVER_ERROR)
          .send({ message: 'Internal server error' })
      }
    })
}
