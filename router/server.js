require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
const app = express()
const port = process.env.PORT
const dorm = require('./dorm')

app.use('/dorm',dorm)


app.listen(port, async () => {
  debug(` listening on port : ${chalk.red(port)}`)
  // console.log(await db.address.findAll({}))
})