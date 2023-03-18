// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose')
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator')
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs')

const { AuthenticationError } = require('../utils/errors')

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

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      // Email is not found error handling
      if (!user) {
        return Promise.reject(new AuthenticationError())
      }
      // Password does not match error handling
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthenticationError())
        }
        return user
      })
    })
}
const User = mongoose.model('user', userSchema)

module.exports = User
