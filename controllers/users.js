// eslint-disable-next-line import/no-extraneous-dependencies
const { ObjectId } = require('mongoose').Types
const User = require('../models/user')

const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors')

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res.status(SERVER_ERROR).send({ message: 'Internal server error' })
    )
}

module.exports.getUser = (req, res) => {
  const { userId } = req.params

  User.findById(userId)
    .orFail(() => {
      if (!ObjectId.isValid(userId)) {
        const error = new Error('Invalid user id')
        error.statusCode = BAD_REQUEST
        throw error
      }
      const error = new Error('User ID not found')
      error.statusCode = NOT_FOUND
      throw error
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.statusCode === BAD_REQUEST) {
        res.status(BAD_REQUEST).send({ message: err.message })
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message })
      } else {
        res.status(SERVER_ERROR).send({ message: 'Internal server error' })
      }
    })
}

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body
    const user = await User.create({ name, avatar })
    res.send(user)
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Invalid data' })
    } else if (error.statusCode === NOT_FOUND) {
      res.status(NOT_FOUND).send({ message: error.message })
    } else {
      res.status(SERVER_ERROR).send({ message: 'Internal server error' })
    }
  }
}
