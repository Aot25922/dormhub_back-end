require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
const app = express()
const port = process.env.PORT
const dorm = require('./dorm')
const db = require('../db/index')
const {zipcode,subDistrict} = db;
try {
   db.sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// app.use('/dorm',dorm)

app.get('/', async (req, res) => {
  info = await zipcode.findAll({include:subDistrict})
  res.json(info)
})
app.listen(port, async () => {
  debug(` listening on port : ${chalk.red(port)}`)
  // console.log(await db.address.findAll({}))
})