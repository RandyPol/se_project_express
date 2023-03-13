const express = require('express')
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose')
const routes = require('./routes')

const { PORT = 3001 } = process.env
const app = express()

mongoose.connect('mongodb://localhost:27017/weather_clothing_db')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)

app.listen(PORT)
