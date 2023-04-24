const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { errors } = require('celebrate')
const routes = require('./routes')
const errorHandler = require('./utils/errorHandler')
const { requestLogger, errorLogger } = require('./middlewares/logger')
const limiter = require('./middlewares/limiter')

const { PORT = 3001 } = process.env
const app = express()

mongoose.connect('mongodb://localhost:27017/weather_clothing_db')

// Log all requests to the request.log file
app.use(requestLogger)

app.use(helmet())
app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
// Log all requests to the console
app.use(morgan('tiny'))

// Server crash testing only for code review process
// This is not a part of the app and will be iliminated as soon as it passes the code review
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now')
  }, 0)
})

// Use the routes
app.use('/', routes)

// Log all errors to the error.log file
app.use(errorLogger)

// Celebrate error handler
app.use(errors())

// Centralized Error handler
app.use(errorHandler)

app.listen(PORT)
