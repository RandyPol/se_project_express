const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = require('../utils/config')
const errorCode = require('../utils/errors')

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, avatar, email, password: hash })
    res.status(201).send({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    })
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(errorCode.BAD_REQUEST).send({ message: 'Invalid data' })
    } else if (err.code === errorCode.DUPLICATE_ERROR) {
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
    if (!user) {
      const error = new Error('User is not found')
      error.statusCode = errorCode.NOT_FOUND
      throw error
    } else {
      res.send(user)
    }
  } catch (err) {
    if (err.statusCode === errorCode.NOT_FOUND) {
      res.status(errorCode.NOT_FOUND).send({ message: err.message })
    } else {
      res
        .status(errorCode.SERVER_ERROR)
        .send({ message: 'Internal server error' })
    }
  }
}

module.exports.updateUser = async (req, res) => {
  const { _id } = req.user
  // Update user data
  const { name, avatar } = req.body

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, avatar },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedUser) {
      const error = new Error('User is not found')
      error.statusCode = errorCode.NOT_FOUND
      throw error
    }
    res.send(updatedUser)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(errorCode.BAD_REQUEST).send({ message: 'Invalid data' })
    } else if (err.statusCode === errorCode.NOT_FOUND) {
      res.status(errorCode.NOT_FOUND).send({ message: err.message })
    } else {
      res
        .status(errorCode.SERVER_ERROR)
        .send({ message: 'Internal server error' })
    }
  }
}
