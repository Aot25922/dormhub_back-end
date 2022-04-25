require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 8080
const dorms = require('./dorm')
app.use(cors())
app.use('/dorm',dorms)

app.get('/', async (req, res) => {
  res.send('คนที่เปิดหน้านี้เสร่อชิบหาย')
})
app.listen(port, async () => {
  debug(` listening on port : ${chalk.red(port)}`)
})