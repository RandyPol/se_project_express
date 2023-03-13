const User = require('../models/user')
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors')

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }))
}

module.exports.getUser = (req, res) => {
  const { userId } = req.params
  User.findById(userId)
    .orFail(() => {
      const error = new Error('User ID not found')
      error.statusCode = NOT_FOUND
      throw error
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid user id' })
      } else if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: err.message })
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: err.message || 'internal server error' })
      }
    })
}

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body
  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }))
}
