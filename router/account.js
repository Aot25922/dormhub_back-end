var express = require('express');
const _ = require('lodash');
const formidable = require('formidable');
var router = express.Router()
const jwt = require('../middleware/jwt')
const db = require('../db/index')
const multer = require('../middleware/multer')
const bcrypt = require('../function/bcrypt');
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

router.post('/register', upload, async (req, res, next) => {
    try {
        let newData = JSON.parse(req.body.data);
        //Check for exist account
        await userAccount.findOne({
            where: sequelize.where(sequelize.fn('BINARY', sequelize.col('email')), newData.email),
        }).then(findAccount => {
            if (findAccount != null) {
                error = new Error('This account already existed')
                error.status = 403
                throw error
            }
        })
        //Create new account
        let encryptPassword = await bcrypt.cryptPassword(newData.password)
        await userAccount.create({
            email: newData.email,
            password: encryptPassword,
            fname: newData.fname,
            lname: newData.lname,
            sex: newData.role,
            phone: newData.phone,
            role: newData.role
        }).then(newAccount => {
            let token = jwt.generateAccessToken(newAccount.dataValues.userId)
            res.cookie("token", token, { domain: '.dormhub.works', httpOnly: true, sameSite: 'strict', secure: true, })
            let result = _.omit(newAccount.dataValues, ['email', 'password'])
            res.status(200).json({ data: result })

        })
    } catch (err) {
        next(err)
    }
})

router.post('/login', [upload, jwt.authenticateToken], async (req, res, next) => {
    try {
        if (req.userId != null) {
            await userAccount.findOne({ where: { userId: req.userId }, include: [{ model: dorm, attributes: ['dormId'] }] }).then(findUserAccount => {
                if (findUserAccount == null) {
                    error = new Error('This account cannot access')
                    error.status = 403
                    throw error
                }
                let result = _.omit(findUserAccount.dataValues, ['email', 'password'])
                res.status(200).json({ data: result })
            })
        }
        else {
            if (req.body == undefined) {
                error = new Error("Cannot login")
                error.status = 403
                throw error
            }
            let newData = JSON.parse(req.body.data)
            await userAccount.findOne({
                attributes: { exclude: ['email'] },
                where: sequelize.where(sequelize.fn('BINARY', sequelize.col('email')), newData.email),
                include: [{ model: dorm, attributes: ['dormId'] }]
            }).then(async findUserAccount => {
                if (!findUserAccount) {
                    error = new Error("Invalid email")
                    error.status = 403
                    throw error
                } else {
                    const comparePassword = await bcrypt.comparePassword(newData.password, findUserAccount.password)
                    if (!comparePassword) {
                        error = new Error("Invalid password")
                        error.status = 403
                        throw error
                    }
                    let token = jwt.generateAccessToken(findUserAccount.userId)
                    res.cookie("token", token, { domain: '.dormhub.works', httpOnly: true, sameSite: 'strict', secure: true })
                    let result = _.omit(findUserAccount.dataValues, ['password'])
                    res.status(200).json({ data: result })
                }
            })
        }
    } catch (err) {
        next(err)
    }
})

router.delete('/logout', async (req, res, next) => {
    try {
        res.clearCookie('token', { domain: '.dormhub.works', httpOnly: true, sameSite: 'strict', secure: true })
        res.status(200).end()
    } catch (err) {
        next(err)
    }
})


module.exports = router