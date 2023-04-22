// Create a middleware to handle errors

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err

  res.statusCode(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  })
}

module.exports = errorHandler