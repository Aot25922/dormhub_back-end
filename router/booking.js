var express = require('express');
var router = express.Router();
const db = require('../db/index');
const multer = require('../middleware/multer')
const upload = multer.upload
const { room, booking, userAccount, bankAccount, sequelize, Op, dorm, roomType } = db;

db.sequelize.sync();
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/owner/:userId', async (req, res, next) => {
    try {
        await dorm.findAll({attributes:['dormId'], where:{ownerId: req.params.userId}}).then(async findDormList => {
            if(findDormList == undefined || findDormList.length == 0){
                error = new Error("Cannot find you dorm")
                error.status = 403
                throw error
            }
            let dormIdList = [];
            for(let i in findDormList){
                dormIdList.push(findDormList[i].dormId)
            }
        let result = await booking.findAll({where:{'$room.dorm.dormId$':{[Op.in]:dormIdList}}, include:[{model: room, include:[{model: dorm}]}]})
        res.status(200).json(result)
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
})

router.get('/:userId', async (req, res, next) => {
    try {
        await booking.findAll({ where: { userId: req.params.userId }, include: [bankAccount, { model: room, include: [roomType, dorm] }] }).then(findBooking =>{
            if(findBooking == undefined || findBooking == null){
                error = new Error("Cannot find you booking")
                error.status = 500
                throw error
            }else{
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
    try {
        await sequelize.transaction(async (t) => {
            //Check for booking
            await room.findOne({ attributes: ['status'], where: { roomId: data.roomId } }, { transaction: t }).then(findRoom => {
                if (findRoom == undefined || findRoom.status == "booking") {
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
                status: "Waiting",
                description: null,
                userId: data.userId,
                bankAccId: data.bankAccId,
                roomId: data.roomId
            }, { transaction: t })

            // Update room status
            await room.update({
                status: "booking"
            }, { where: { roomId: data.roomId }, transaction: t })
        })
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        next(err)
    }
})

module.exports = router