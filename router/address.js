var express = require('express');
var router = express.Router();
const db = require('../db/index');
const { provinces, districts, subDistricts, geographies } = db;

db.sequelize.sync();
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

//get all address
router.get('/', async (req, res, next) => {
    try {
        let getAddress = await geographies.findAll({ include: { model: provinces, include: { model: districts, include: { model: subDistricts } } } })
        res.status(200).json(getAddress)
    } catch (err) {
        next(err)
    }
})

module.exports = router