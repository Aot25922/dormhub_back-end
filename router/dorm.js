var express = require('express')
var router = express.Router()
const chalk = require('chalk')
const mysql = require('mysql')
// const connection = mysql.createConnection({
//     host: 'bom2321.thddns.net',
//     user: 'int365',
//     password: "9Q7@e4>+#p;+LHpYd_GU2Y$.a?\\uhCg*",
//     database: 'int365_dormhub'
// })
const pool = mysql.createPool({
    host: 'bom2321.thddns.net',
    user: 'int365',
    password: "9Q7@e4>+#p;+LHpYd_GU2Y$.a?\\uhCg*",
    database: 'int365_dormhub',
    debug    :  false
});
// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})
router.get('/', (req, res) => {
    pool.query(
        "SELECT * FROM dorm d, address a, addrDetail ad, location l WHERE d.dormId=a.dormId AND a.zipCode=ad.zipCode AND ad.locationId=l.locationId"
        , function (err, result) {
        if (err) {
             console.log(chalk.red(err.sqlMessage))
             res.json(err.sqlMessage)
        };
        res.json(result)
    });
})

module.exports = router