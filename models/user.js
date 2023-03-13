// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose')
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Please enter a valid URL',
    },
  },
})

const User = mongoose.model('user', userSchema)

module.exports = User
