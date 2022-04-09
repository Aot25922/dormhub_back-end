var express = require('express')
var router = express.Router()
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'bom2321.thddns.net',
    user: 'int365',
    password: "9Q7@e4>+#p;+LHpYd_GU2Y$.a?\\uhCg*",
    database: 'int365_dormhub'
})
connection.connect()
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})
router.get('/', (req, res) => {
    connection.query("SELECT *  FROM dorm, address, region WHERE  dorm.addressId=address.addressId AND address.addressId=region.addressId", function (err, result, fields) {
        res.json(result)
    });
})

module.exports = router