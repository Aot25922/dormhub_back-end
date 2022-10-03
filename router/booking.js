var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../db/index');
const multer = require('../middleware/multer')
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

router.get('/image/:bookingId', async (req, res, next) => {
    try {
        let imgPath = await booking.findOne({ where: { bookingId: req.params.bookingId } })
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
router.get('/owner/:userId', async (req, res, next) => {
    try {
        await dorm.findAll({ attributes: ['dormId'], where: { ownerId: req.params.userId } }).then(async findDormList => {
            if (findDormList == undefined || findDormList.length == 0) {
                error = new Error("Cannot find you dorm")
                error.status = 403
                throw error
            }
            let dormIdList = [];
            for (let i in findDormList) {
                dormIdList.push(findDormList[i].dormId)
            }
            let result = await booking.findAll({ where: { '$room.dormId$': { [Op.in]: dormIdList } }, include: [bankAccount, { model: room, as: 'room', include: { model: roomType, include: { model: dorm } } }] })
            res.status(200).json(result)
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
})

router.put('/owner/update', [upload], async (req, res, next) => {
    let data = JSON.parse(req.body.data)
    try {
        //Check for booking
        let result = await booking.findOne({ where: { bookingId: data.bookingId }, include: [{ model: room, as: 'room', where: { roomId: data.roomId }, include: { model: roomType, where: { roomTypeId: data.roomTypeId }, include: { model: dorm, where: { dormId: data.dormId } } } }] })
        if (result == undefined || result == null) {
            error = new Error("Cannot find you booking")
            error.status = 403
            throw error
        }
        await booking.update({
            status: data.status
        }, {
            where: { bookingId: data.bookingId }
        })
        if (data.status == "ยกเลิก") {
            await room.update({
                status: "ว่าง"
            }, { where: { roomId: data.roomId } })
            fs.unlinkSync(result.moneySlip)
        }
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        next(err)
    }
})

router.get('/:userId', async (req, res, next) => {
    try {
        await booking.findAll({ where: { userId: req.params.userId }, include: [bankAccount, { model: room, include: [{ model: roomType, include: [dorm] }] }] }).then(findBooking => {
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
router.post('/new', upload, async (req, res, next) => {
    let data = JSON.parse(req.body.data)
    let files = req.files
    console.log(files[0].path)
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
            await booking.findOne({ where: { roomId: data.roomId } }, { transaction: t }).then(findBooking => {
                if (findBooking != undefined || findBooking != null) {
                    error = new Error("This room already booking")
                    error.status = 403
                    throw error
                }
            })

            //Check for customer role
            await userAccount.findOne({ attributes: ['role'], where: { userId: data.userId } }, { transaction: t }).then(findUser => {
                console.log(findUser)
                if (findUser.role == undefined || findUser.role != "Customer") {
                    error = new Error("This account is not customer")
                    error.status = 403
                    throw error
                }
            })
            //Check for bankAccount
            await bankAccount.findAll({ where: { dormId: data.dormId } }, { transaction: t }).then(findBankAccount => {
                if (findBankAccount == undefined || findBankAccount == null) {
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
                moneySlip: files[0].path,
                userId: data.userId,
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
        files.forEach(async (file) => {
            fs.unlinkSync(file.path)
        })
        next(err)
    }
})

module.exports = router