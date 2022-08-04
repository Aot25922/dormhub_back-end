require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3001
const dorms = require('./dorm')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/dorm',dorms)

app.get('/', async (req, res) => {
  res.send('Hello Boy!')
})

app.use((req,res,next)=>{
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
app.use((error,req,res,next)=>{
  res.status(error.status || 500)
  console.log(error)
  res.json({
    error : {
      message : error.message
    }
  })
})
app.listen(port, async () => {
  debug(` listening on port : ${chalk.red(port)}`)
})