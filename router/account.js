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

router.post('/register', upload, async (req, res, next) => {
    try {
        let newData = JSON.parse(req.body.data);
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
                let token = jwt.generateAccessToken(resAccount.userId)
                console.log(token)
                res.cookie("token", token, { httpOnly: true })
                res.status(200).json({ status: "register complete" })
            })
        })
    } catch (err) {
        next(err)
    }
})

router.post('/login', [upload, jwt.authenticateToken], async (req, res, next) => {
    try {
        if (req.user != null) {
            await userAccount.findOne({ where: { userId: req.user.userId } }).then(findUserAccount => {
                if (findUserAccount == null) {
                    error = new Error('This account cannot access')
                    error.status = 403
                    throw error
                }
                res.status(200).json({ data: findUserAccount })
            })
        }
        else {
            let newData = JSON.parse(req.body.data)
            await userAccount.findOne({
                attributes: { exclude: ['password', 'email'] },
                where: {
                    [Op.and]: [{ email: newData.email },
                    { password: newData.password }]
                },
                include: [{ model: dorm, attributes: ['dormId'] }]
            }).then(findUserAccount => {
                if (!findUserAccount) {
                    error = new Error("Invalid userAccount")
                    error.status = 500
                    throw error
                } else {
                    let token = jwt.generateAccessToken(findUserAccount.userId)
                    res.cookie("token", token, { httpOnly: true })
                    res.status(200).json({ data: findUserAccount })
                }
            })
        }
    } catch (err) {
        next(err)
    }
})

router.delete('/logout', async (req, res, next) => {
    try {
        console.log(req.cookies)
        res.clearCookie('token')
        res.status(200).end()
    } catch (err) {
        next(err)
    }
})


module.exports = router