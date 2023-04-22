const ClothingItem = require('../models/clothingItem')
const BadRequestError = require('../utils/errors/BadRequestError')
const ForbiddenError = require('../utils/errors/ForbiddenError')
const NotFoundError = require('../utils/errors/NotFoundError')

module.exports.getClothingItems = async (req, res, next) => {
  try {
    const clothingItems = await ClothingItem.find({})
    res.send(clothingItems)
  } catch (error) {
    next(new Error('Internal server error'))
  }
}

module.exports.createClothingItem = async (req, res, next) => {
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
      next(new BadRequestError('Invalid data'))
    } else {
      next(new Error('Internal server error'))
    }
  }
}

/**
 *
 * Below will be the controllers for individual clothing items functionality
 */

module.exports.deleteClothingItem = async (req, res, next) => {
  const { itemId } = req.params
  const { _id } = req.user
  try {
    const clothingItem = await ClothingItem.findById(itemId).orFail(() => {
      throw new NotFoundError('Clothing ID not found')
    })

    if (clothingItem.owner.toString() !== _id) {
      throw new ForbiddenError('Forbidden Action')
    }

    const deleteClothingItem = await ClothingItem.findByIdAndRemove(itemId)

    res.status(200).send(deleteClothingItem)
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid clothes id'))
    } else {
      next(err)
    }
  }
}

module.exports.likeItem = async (req, res, next) => {
  const { itemId } = req.params
  const { _id } = req.user
  try {
    const clothingItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: _id } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError('Clothing ID not found')
    })
    res.send(clothingItem)
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid clothes id'))
    } else {
      next(err)
    }
  }
}

module.exports.dislikeItem = async (req, res, next) => {
  const { itemId } = req.params
  const { _id } = req.user
  try {
    const clothingItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: _id } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError('Clothing ID not found')
    })
    res.send(clothingItem)
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid clothes id'))
    } else {
      next(err)
    }
  }
}
