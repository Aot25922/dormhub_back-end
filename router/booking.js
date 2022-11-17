var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../db/index');
const multer = require('../middleware/multer')
const jwt = require('../middleware/jwt');
const upload = multer.upload
const { room, booking, userAccount, bankAccount, sequelize, Op, dorm, roomType } = db;
var mime = {
    jpg: 'image/jpeg',
    png: 'image/png',
};

db.sequelize.sync();
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

//nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dormhub.work@gmail.com',
        pass: 'tjzactygnkmjepvl'
    }
});

router.get('/image/:bookingId', [jwt.authenticateToken], async (req, res, next) => {
    try {
        let imgPath = await booking.findOne({ where: { bookingId: req.params.bookingId }, include: [{ model: bankAccount, include: [dorm] }] })
        await userAccount.findOne({ where: { userId: req.userId } }).then(findUserAccount => {
            if (findUserAccount.role == "Customer") {
                if (imgPath.userId != findUserAccount.userId) {
                    error = new Error('Cannot get image for you role')
                    error.status = 403
                    throw error
                }
            } else if (findUserAccount.role == "Owner") {
                if (imgPath.bankAccount.dorm.ownerId != findUserAccount.userId) {
                    error = new Error('Cannot get image for you role')
                    error.status = 403
                    throw error
                }
            }
            else {
                error = new Error('Cannot get image for you role')
                error.status = 403
                throw error
            }
        })
        if (imgPath != null) {
            var type = mime[path.extname(imgPath.moneySlip).slice(1)] || 'image/png';
            var s = fs.createReadStream(path.join(__dirname, '../', imgPath.moneySlip));
            s.on('open', function () {
                res.set('Content-Type', type);
                return s.pipe(res);
            });
            s.on('error', function () {
                res.set('Content-Type', type);
                res.status(404).end('Cannot get image for booking');
            });
        } else {
            error = new Error('Cannot get image for booking')
            error.status = 404
            throw error
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
})
router.get('/owner', [jwt.authenticateToken], async (req, res, next) => {
    try {
        //Check for userAccount
        await userAccount.findOne({ where: { userId: req.userId } }).then(findUserAccount => {
            if (findUserAccount == undefined || findUserAccount.role != "Owner") {
                error = new Error('This account cannot access')
                error.status = 403
                throw error
            }
        })
        await dorm.findAll({ attributes: ['dormId'], where: { ownerId: req.userId } }).then(async findDormList => {
            if (findDormList == undefined || findDormList.length == 0) {
                error = new Error("Cannot find you dorm")
                error.status = 500
                throw error
            }
            let dormIdList = [];
            for (let i in findDormList) {
                dormIdList.push(findDormList[i].dormId)
            }
            let result = await booking.findAll({ where: { '$room.dormId$': { [Op.in]: dormIdList } }, include: [bankAccount, userAccount, { model: room, as: 'room', include: { model: roomType, include: { model: dorm } } }] })
            res.status(200).json(result)
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
})

router.put('/owner/update', [upload, jwt.authenticateToken], async (req, res, next) => {
    let data = JSON.parse(req.body.data)
    try {
        await sequelize.transaction(async (t) => {
            //Check Status
            const statusList = ["ยืนยันการโอน", "รอการโอน", "ยกเลิก"]
            if (!statusList.includes(data.status)) {
                error = new Error('This status not found')
                error.status = 403
                throw error
            }
            //Check for userAccount
            await userAccount.findOne({ where: { userId: req.userId } }).then(findUserAccount => {
                if (findUserAccount == undefined || findUserAccount.role != "Owner") {
                    error = new Error('This account cannot access')
                    error.status = 403
                    throw error
                }
            })
            //Check for booking
            let result = await booking.findOne({ where: { bookingId: data.bookingId }, include: [room, userAccount,{model: bankAccount, include:[dorm]}] })
            if (result == undefined || result == null) {
                error = new Error("Cannot find you booking")
                error.status = 403
                throw error
            }
            if(result.bankAccount.dorm.ownerId != req.userId){
                error = new Error("This account cannot access")
                error.status = 403
                throw error
            }
            await booking.update({
                status: data.status
            }, {
                where: { bookingId: data.bookingId }, transaction: t
            })
            if (data.status == "ยกเลิก") {
                await room.update({
                    status: "ว่าง"
                }, { where: { roomId: data.roomId }, transaction: t })
            }
            let mailOptions = {
                from: 'dormHub.work@gmail.com',
                to: result.userAccount.email,
                subject: 'สถานะการจองห้องพักของคุณที่การเปลี่ยนเเปลง',
                text: `การจองห้องพักหมายเลข ${result.room.roomNum} มีการเปลี่ยนสถานะจาก '${result.status}' เป็น '${data.status}'`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })
        })

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        next(err)
    }
})

router.get('/', [jwt.authenticateToken], async (req, res, next) => {
    try {
        //Check for userAccount
        await userAccount.findOne({ where: { userId: req.userId } }).then(findUserAccount => {
            if (findUserAccount == undefined || findUserAccount.role != "Customer") {
                error = new Error('This account cannot access')
                error.status = 403
                throw error
            }
        })
        await booking.findAll({ where: { userId: req.userId }, include: [bankAccount, { model: room, include: [{ model: roomType, include: [dorm] }] }] }).then(findBooking => {
            if (findBooking == undefined || findBooking == null) {
                error = new Error("Cannot find you booking")
                error.status = 500
                throw error
            } else {
                res.status(200).json(findBooking)
            }
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
})
router.post('/new', [upload, jwt.authenticateToken], async (req, res, next) => {
    let data = JSON.parse(req.body.data)
    try {
        await sequelize.transaction(async (t) => {
            //Check for booking
            await room.findOne({ attributes: ['status'], where: { roomId: data.roomId } }, { transaction: t }).then(findRoom => {
                if (findRoom == undefined || findRoom.status == "จองเเล้ว") {
                    error = new Error("Cannot booking this room")
                    error.status = 403
                    throw error
                }
            })
            await booking.findAll({ where: { roomId: data.roomId } }, { transaction: t }).then(findBooking => {
                for (let i in findBooking) {
                    if (findBooking[i].status == "รอการยืนยัน") {
                        error = new Error("This room already booking")
                        error.status = 403
                        throw error
                    }
                }
            })

            //Check for customer role
            await userAccount.findOne({ attributes: ['role'], where: { userId: req.userId } }, { transaction: t }).then(findUser => {
                console.log(findUser)
                if (findUser.role == undefined || findUser.role != "Customer") {
                    error = new Error("This account is not customer")
                    error.status = 403
                    throw error
                }
            })

            //Check for bankAccount
            await bankAccount.findAll({ where: { dormId: data.dormId } }, { transaction: t }).then(findBankAccount => {
                let checkBankAccount = []
                for (let i in findBankAccount) {
                    checkBankAccount.push(findBankAccount[i].bankAccId)
                }
                if (!checkBankAccount.includes(data.bankAccId)) {
                    error = new Error("This bankAccount not right")
                    error.status = 403
                    throw error
                }
            })

            //Check for room
            await room.findOne({ where: { [Op.and]: [{ roomId: data.roomId }, { dormId: data.dormId }] } }, { transaction: t }).then(findRoom => {
                if (findRoom == undefined || findRoom == null) {
                    error = new Error("This room not right")
                    error.status = 403
                    throw error
                }
            })
            //Create booking table
            await booking.create({
                payDate: Date.now(),
                startDate: data.startDate,
                endDate: data.endDate,
                status: "รอการยืนยัน",
                description: data.description,
                userId: req.userId,
                bankAccId: data.bankAccId,
                roomId: data.roomId
            }, { transaction: t })

            // Update room status
            await room.update({
                status: "จองเเล้ว"
            }, { where: { roomId: data.roomId }, transaction: t })
        })
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        next(err)
    }
})

router.put('/update', [upload, jwt.authenticateToken], async (req, res, next) => {
    let data = JSON.parse(req.body.data)
    let files = req.files
    try {
        await sequelize.transaction(async (t) => {
            //Check for userAccount
            let findUserAccount = await userAccount.findOne({ where: { userId: req.userId } })
            if (findUserAccount == undefined || findUserAccount.role != "Customer") {
                error = new Error('This account cannot access')
                error.status = 403
                throw error
            }
            //Check for booking
            let result = await booking.findOne({ where: { bookingId: data.bookingId }, include: [{ model: room, include: [{ model: dorm, include: [userAccount] }] }] })
            if (result == undefined || result == null) {
                error = new Error("Cannot find you booking")
                error.status = 403
                throw error
            }
            if (data.status == "ยืนยันการโอน") {
                if (result.moneySlip && files[0]) {
                    if (fs.existsSync(result.moneySlip)) {
                        fs.unlinkSync(result.moneySlip)
                    }
                }
                if (!files[0]) {
                    error = new Error("No money slip")
                    error.status = 403
                    throw error
                }
                await booking.update({
                    status: data.status,
                    moneySlip: files[0].path,
                }, {
                    where: { bookingId: data.bookingId }, transaction: t
                })
            } else if (data.status == "ยกเลิก") {
                await booking.update({
                    status: data.status
                }, {
                    where: { bookingId: data.bookingId }, transaction: t
                })
                await room.update({
                    status: "ว่าง"
                }, { where: { roomId: data.roomId }, transaction: t })
            }
            let mailOptions
            if (result.status == "ยืนยันการโอน") {
                mailOptions = {
                    from: 'dormHub.work@gmail.com',
                    to: result.room.dorm.userAccount.email,
                    subject: 'ใบสลิปการจ่ายค่าจองห้องพักมีการเปลี่ยนเเปลง',
                    text: `ห้องพักหมายเลข ${result.room.roomNum} มีการเปลี่ยนใบสลิปการจ่ายค่าจองห้องพักของผู้ใช้ ชื่อ : ${findUserAccount.fname} ${findUserAccount.lname} e-mail : ${findUserAccount.email} เบอร์โทร : ${findUserAccount.phone}`
                };
            }
            else {
                mailOptions = {
                    from: 'dormHub.work@gmail.com',
                    to: result.room.dorm.userAccount.email,
                    subject: 'สถานะการจองห้องพักของคุณที่การเปลี่ยนเเปลง',
                    text: `การจองห้องพักหมายเลข ${result.room.roomNum} มีการเปลี่ยนสถานะจาก '${result.status}' เป็น '${data.status}'`
                };
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })
        })
        res.sendStatus(200)
    } catch (err) {
        files.forEach(async (file) => {
            fs.unlinkSync(file.path)
        })
        console.log(err)
        next(err)
    }
})

module.exports = router