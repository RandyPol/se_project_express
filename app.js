const express = require('express')
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose')
const userRouter = require('./routes/users')
const clothingItemRouter = require('./routes/clothingItems')

const { PORT = 3001 } = process.env
const app = express()

mongoose.connect('mongodb://localhost:27017/weather_clothing_db')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/users', userRouter)
app.use('/clothingItems', clothingItemRouter)

app.listen(PORT)
