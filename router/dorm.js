var express = require('express')
var router = express.Router()
const chalk = require('chalk')
const db = require('../db/index')
const {subDistrict,address,province,region,booking,userAccount,bank,bankAccount,detail,room,roomType,dorm,media,district} = db;

try {
    db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', async(req, res) => {
    result = await dorm.findAll({
        include: {
          model: address,
          include: {
            model: subDistrict,
            include: {
              model: district,
              include: {
                model: province,
                include: region
              }
            }
          }
        }
      })
      res.json(result)
})

module.exports = router