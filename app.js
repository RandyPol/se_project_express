const express = require('express')
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose')

const { PORT = 3001 } = process.env
const app = express()

mongoose.connect('mongodb://localhost:27017/weather_clothing_db')

app.listen(PORT)
