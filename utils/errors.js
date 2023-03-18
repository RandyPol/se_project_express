// Custom error classes
// eslint-disable-next-line max-classes-per-file
class AuthenticationError extends Error {
  constructor(message = 'Incorrect password or email') {
    super(message)
    this.name = 'AuthenticationError'
    this.statusCode = 401
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Forbidden Action') {
    super(message)
    this.name = 'ForbiddenError'
    this.statusCode = 401
  }
}

module.exports = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  DUPLICATE_ERROR: 11000,
  CONFLICT_DATA: 409,
  UNAUTHORIZED_ERROR: 401,
}

module.exports.AuthenticationError = AuthenticationError
module.exports.AuthenticationError = ForbiddenError
