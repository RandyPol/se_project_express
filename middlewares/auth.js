const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../utils/config')
const UnauthorizedError = require('../utils/errors/UnauthorizedError')

const extractBearerToken = (header) => header.replace('Bearer ', '')

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization Error')
  }

  const token = extractBearerToken(authorization)
  let payload

  try {
    payload = jwt.verify(token, JWT_SECRET)
  } catch (err) {
    throw new UnauthorizedError('Authorization Error')
  }

  req.user = payload
  return next()
}
