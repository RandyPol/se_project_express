const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = require('../utils/config')
const BadRequestError = require('../utils/errors/BadRequestError')
const UnauthorizedError = require('../utils/errors/UnauthorizedError')
const NotFoundError = require('../utils/errors/NotFoundError')
const ConflictError = require('../utils/errors/ConflictError')
const errorCode = require('../utils/errorsCode')

module.exports.createUser = async (req, res, next) => {
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
      next(new BadRequestError('Invalid data'))
    } else if (err.code === errorCode.DUPLICATE_ERROR) {
      next(new ConflictError('Email already exist'))
    } else {
      next(new Error('Internal server error'))
    }
  }
}

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await User.findUserByCredentials(email, password)
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    })
    res.send({
      token,
      user,
    })
  } catch (error) {
    if (error.name === 'AuthenticationError') {
      next(new UnauthorizedError('Invalid email or password'))
    } else {
      next(new Error('Internal server error'))
    }
  }
}

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => {
      throw new NotFoundError('User is not found')
    })
    res.send(user)
  } catch (err) {
    next(err)
  }
}

module.exports.updateUser = async (req, res, next) => {
  const { _id } = req.user
  // Update user data
  const { name, avatar } = req.body

  try {
    const upDateUser = await User.findByIdAndUpdate(
      _id,
      { name, avatar },
      {
        new: true,
        runValidators: true,
      }
    ).orFail(() => {
      throw new NotFoundError('User is not found')
    })
    res.send(upDateUser)
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid data'))
    } else {
      next(err)
    }
  }
}
