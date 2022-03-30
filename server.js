require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
// const mysql = require('mysql')
const app = express()
const port = process.env.PORT

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'dbuser',
//     password: 's3kreee7',
//     database: 'my_db'
//   })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  debug(` listening on port : ${chalk.red(port)}`)
})