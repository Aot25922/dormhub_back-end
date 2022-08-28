var express = require('express');
var router = express.Router();
const db = require('../db/index');
const { bank } = db;

db.sequelize.sync();
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

//get all address
router.get('/', async (req, res, next) => {
    try {
        let getBank = await bank.findAll()
        res.status(200).json(getBank)
    } catch (err) {
        next(err)
    }
})

module.exports = router