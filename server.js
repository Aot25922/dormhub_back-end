const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  debug(` listening on port : ${chalk.red(port)}`)
})