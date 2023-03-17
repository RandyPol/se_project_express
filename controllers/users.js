// eslint-disable-next-line import/no-extraneous-dependencies
const { ObjectId } = require('mongoose').Types
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const errorCode = require('../utils/errors')

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(errorCode.SERVER_ERROR)
        .send({ message: 'Internal server error' })
    )
}

module.exports.getUser = (req, res) => {
  const { userId } = req.params

  User.findById(userId)
    .orFail(() => {
      if (!ObjectId.isValid(userId)) {
        const error = new Error('Invalid user id')
        error.statusCode = errorCode.BAD_REQUEST
        throw error
      }
      const error = new Error('User ID not found')
      error.statusCode = errorCode.NOT_FOUND
      throw error
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.statusCode === errorCode.BAD_REQUEST) {
        res.status(errorCode.BAD_REQUEST).send({ message: err.message })
      } else if (err.statusCode === errorCode.NOT_FOUND) {
        res.status(errorCode.NOT_FOUND).send({ message: err.message })
      } else {
        res
          .status(errorCode.SERVER_ERROR)
          .send({ message: 'Internal server error' })
      }
    })
}

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, avatar, email, password: hash })
    res.send(user)
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(errorCode.BAD_REQUEST).send({ message: 'Invalid data' })
    } else if (error.statusCode === errorCode.NOT_FOUND) {
      res.status(errorCode.NOT_FOUND).send({ message: error.message })
    } else if (error.code === errorCode.DUPLICATE_ERROR) {
      res
        .status(errorCode.CONFLICT_DATA)
        .send({ message: 'Email already exist' })
    } else {
      res
        .status(errorCode.SERVER_ERROR)
        .send({ message: 'Internal server error' })
    }
  }
}
