const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
require('dotenv').config()

// server stuff
const app = express()
const port = 1080

// mongoose stuff
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: {
    user: 'root',
    password: process.env.MONGODB_ROOT_PASSWORD,
  },
  replicaSet: {
    rs_name: process.env.MONGO_REPLICASET
  },
  authSource: 'admin'
})
console.log(process.env.MONGO_URI)
const Stuff = mongoose.model('Stuff', { name: String })

// path to publid
const htmlPath = path.join(__dirname, 'public')

// routes
app.use(express.static(htmlPath))

app.get('/save', (req, res) => {
  const { val } = req.query
  const something = new Stuff({ name: val || 'empty' })
  something.save().then(() => console.log('saved new data'))
  res.send(val || 'empty')
})

app.get('/get', async (req, res) => {
  const stuffs = await Stuff.find({}).lean().exec()
  res.send(stuffs)
})

// server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})