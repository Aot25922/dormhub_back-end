var express = require('express')
var router = express.Router()
const chalk = require('chalk')

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', (req, res) => {
    pool.query(
        "SELECT * FROM dorm d, address a, addrDetail ad, location l WHERE d.addressId=a.addressId AND a.zipCode=ad.zipCode AND ad.locationId=l.locationId",
        function (err, result) {
            if (err) {
                console.log(chalk.red(err.sqlMessage))
                res.json(err.sqlMessage)
            };
            res.send(result)
        });
})

module.exports = router