const chalk = require('chalk')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const Card = require('./models/Card')
const User = require('./models/User')

const { PORT, MONGODB } = process.env

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to mongodb'))
  .catch(error => console.error('Could not connect to mongodb', error))

const app = express()
app.use(express.static('client/build', { dotfiles: 'deny' }))
app.use(express.json())

app.get('/api/users', async (req, res, next) => {
  res.json(await User.find().catch(next))
})

app.get('/api/users/:id', async (req, res, next) => {
  const { id } = req.params
  res.json(await User.findById(id).catch(next))
})

app.delete('/api/users/:id', async (req, res, next) => {
  const { id } = req.params
  res.json(await User.findByIdAndDelete(id).catch(next))
})

app.post('/api/users', async (req, res, next) => {
  res.json(await User.create(req.body).catch(next))
})

app.get('/api/cards', async (req, res, next) => {
  res.json(await Card.find().populate('author').catch(next))
})

app.get('/api/cards/:id', async (req, res, next) => {
  const { id } = req.params
  res.json(await Card.findById(id).populate('author').catch(next))
})

app.post('/api/cards', async (req, res, next) => {
  res.json(await Card.create(req.body).catch(next))
})

app.patch('/api/cards/:id/vote', async (req, res, next) => {
  const { id } = req.params
  res.json(
    await Card.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } },
      { new: true }
    ).catch(next)
  )
})

app.delete('/api/cards/:id', async (req, res, next) => {
  const { id } = req.params
  res.json(await Card.findByIdAndDelete(id).catch(next))
})

app.use((err, req, res, next) => {
  console.error(chalk.red('ERROR:'), err)
  res.status(400).json({ ERROR: err.message })
})

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
