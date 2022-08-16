var express = require('express');
const _ = require('lodash');
const formidable = require('formidable');
var router = express.Router()
const jwt = require('../middleware/jwt')
const db = require('../db/index')
const multer = require('../middleware/multer')
const upload = multer.upload
const { userAccount, dorm, Op, sequelize } = db;
var mime = {
    jpg: 'image/jpeg',
    png: 'image/png',
};
db.sequelize.sync();
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', async (req, res, next) => {
    try {
        var data = await userAccount.findAll()
        if (!data || data.length == 0) {
            error = new Error("Cannot get all account")
            error.status = 500
            throw error
        } else {
            res.status(200).json(data)
        }
    } catch (err) {
        next(err)
    }
})

router.post('/register', async (req, res, next) => {
    const form = formidable({ multiples: true });
    let newData ;
    await form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        newData = JSON.parse(fields.data)
    });
    try {
        //Check for exist account
        await userAccount.findOne({
            where: { email: newData.email }
        }).then(findAccount => {
            if (findAccount != null) {
                error = new Error('This account already existed')
                error.status = 403
                throw error
            }
        })
        //Create new account
        await userAccount.create({
            email: newData.email,
            password: newData.password,
            fname: newData.fname,
            lname: newData.lname,
            sex: newData.role,
            phone: newData.phone,
            role: newData.role
        }).then(newAccount => {
            console.log(newAccount.dataValues)
            userAccount.findOne({
                where: {
                    [Op.and]: [{ email: newAccount.dataValues.email },
                    { password: newAccount.dataValues.password }]
                },
                include: [{ model: dorm, attributes: ['dormId'] }]
            }).then(resAccount => {
                res.status(200).json(resAccount)
            })
        })
    } catch (err) {
        next(err)
    }
})

router.post('/login', upload, async (req, res, next) => {
    try {
        console.log(req.body)
        let newData = JSON.parse(req.body.data);
        var data = await userAccount.findOne({
            where: {
                [Op.and]: [{ email: newData.email },
                { password: newData.password }]
            },
            include: [{ model: dorm, attributes: ['dormId'] }]
        })
        if (!data || data.length == 0) {
            error = new Error("Cannot get all account")
            error.status = 500
            throw error
        } else {
            let token = jwt.generateAccessToken(data.userId)
            res.status(200).json({token:token})
        }
    } catch (err) {
        next(err)
    }
})


module.exports = router