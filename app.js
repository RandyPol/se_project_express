const express = require('express')
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose')
// eslint-disable-next-line import/no-extraneous-dependencies
const morgan = require('morgan')
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit')
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet')
const routes = require('./routes')

const { PORT = 3001 } = process.env
const app = express()

mongoose.connect('mongodb://localhost:27017/weather_clothing_db')

// Seting up the rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
})

app.use(helmet())
app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Log all requests to the console
app.use(morgan('tiny'))

// Add a temporary user middleware to all requests
app.use((req, res, next) => {
  req.user = {
    _id: '640ec52391403239e214b720',
  }
  next()
})

// Use the routes
app.use('/', routes)

app.listen(PORT)
