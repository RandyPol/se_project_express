// eslint-disable-next-line import/no-extraneous-dependencies
const { ObjectId } = require('mongoose').Types
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs')
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = require('../utils/config')
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
    res.status(201).send({
      _id: user._id,
      email: user.email,
    })
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

module.exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findUserByCredentials(email, password)
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    })
    res.send({
      token,
    })
  } catch (error) {
    if (error.name === 'AuthenticationError') {
      res.status(errorCode.UNAUTHORIZED_ERROR).send({ message: error.message })
    } else {
      res
        .status(errorCode.SERVER_ERROR)
        .send({ message: 'Internal server error' })
    }
  }
}

module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.send(user)
  } catch (error) {
    res
      .status(errorCode.SERVER_ERROR)
      .send({ message: 'Internal server error' })
  }
}
