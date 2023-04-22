const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const errorCode = require('../utils/errorsCode')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    default: 'Elise Bouer',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Please enter a valid URL',
    },
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Wrong email format',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
})

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password
) {
  const user = await this.findOne({ email }).select('+password')
  if (!user) {
    const error = new Error('Incorrect password or email')
    error.statusCode = errorCode.UNAUTHORIZED_ERROR
    error.name = 'AuthenticationError'
    throw error
  }
  const matched = await bcrypt.compare(password, user.password)
  if (!matched) {
    const error = new Error('Incorrect password or email')
    error.statusCode = errorCode.UNAUTHORIZED_ERROR
    error.name = 'AuthenticationError'
    throw error
  }

  return user
}
const User = mongoose.model('user', userSchema)

module.exports = User
