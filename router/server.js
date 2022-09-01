require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3001
const dorms = require('./dorm')
const account = require('./account')
const address = require('./address')
const bank = require('./bank')
const jwt = require('../middleware/jwt')
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
  exposedHeaders: ["set-cookie"]}))
app.use('/account',account)
app.use('/dorm',dorms)
app.use('/address',address)
app.use('/bank',bank)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
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