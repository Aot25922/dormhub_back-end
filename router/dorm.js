var express = require('express');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
var router = express.Router()
const db = require('../db/index')
const jwt = require('../middleware/jwt')
const multer = require('../middleware/multer')
const func = require('../function/function');
const upload = multer.upload
const { subDistricts, address, provinces, geographies, userAccount, room, roomType, dorm, media, districts, dormHasRoomType, Op, sequelize, bankAccount, booking } = db;
var mime = {
  jpg: 'image/jpeg',
  png: 'image/png',
};
db.sequelize.sync();
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

//Validate dorm name
router.post('/validateDorm', upload, async (req, res, next) => {
  let newData = JSON.parse(req.body.data)
  try {
    let data = await dorm.findOne({ where: { name: newData.dormName } })
    if (data != undefined || data != null) {
      res.json(false).status(200)
    } else {
      res.json(true).status(200)
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
})

//get dorm image
router.get('/image/:dormId/:mediaId', async (req, res, next) => {
  try {
    var data = await media.findOne({
      where: {
        [Op.and]: [{ mediaId: req.params.mediaId },
        { dormId: req.params.dormId }, { roomTypeId: { [Op.is]: null } }]
      }
    })
    if (data != null) {
      var type = mime[path.extname(data.path).slice(1)] || 'image/png';
      var s = fs.createReadStream(path.join(__dirname, '../', data.path));
      s.on('open', function () {
        res.set('Content-Type', type);
        return s.pipe(res);
      });
      s.on('error', function () {
        res.set('Content-Type', type);
        res.status(404).end('Cannot get image for Dorm');
      });
    } else {
      res.set('Content-Type', type);
      res.status(404).end("Bruh");
    }
  } catch (err) {
    next(err)
  }
})

//get roomtype image
router.get('/image/:dormId/:mediaId/:roomTypeId', async (req, res, next) => {
  let data;
  try {
    data = await media.findOne({
      where: {
        [Op.and]: [{ mediaId: req.params.mediaId }, { dormId: req.params.dormId },
        { roomTypeId: req.params.roomTypeId }]
      }
    })
    if (data != null) {
      var type = mime[path.extname(data.path).slice(1)] || 'image/png';
      var s = fs.createReadStream(path.join(__dirname, '../', data.path));
      s.on('open', function () {
        res.set('Content-Type', type);
        return s.pipe(res);
      });
      s.on('error', function () {
        res.set('Content-Type', type);
        res.status(404).end('Cannot get image for roomType');
      });
    } else {
      error = new Error('Cannot get image for roomType')
      error.status = 404
      throw error
    }
  } catch (err) {
    next(err)
  }
})

//get all dorm
router.get('/', async (req, res, next) => {
  try {
    const pageasNumber = parseInt(req.query.page)
    const limitasNumber = parseInt(req.query.limit)

    let page = 0
    if (!isNaN(pageasNumber) && pageasNumber > 0) {
      page = pageasNumber
    }

    let limit = 10

    if (!isNaN(limitasNumber) && limitasNumber > 0) {
      limit = limitasNumber
    }
    let result = await dorm.findAndCountAll({
      limit: limit,
      offset: page * limit,
      distinct: true,
      include: [{
        model: address,
        attributes: ['number', 'street', 'alley'],
        include: {
          model: subDistricts,
          attributes: ['name_th', 'zip_code'],
          include: {
            model: districts,
            attributes: ['name_th'],
            include: {
              model: provinces,
              attributes: ['name_th', 'img'],
              include: {
                model: geographies,
                attributes: ['name']
              }
            }
          }
        }
      }, { model: roomType, through: { attributes: ['price', 'area', 'deposit'] } }, room, { model: userAccount, attributes: ['fname', 'lname', 'email', 'phone'] }, media, { model: bankAccount, attributes: ['accountNum', 'accountName', 'qrcode'] }
      ]
    })
    if (!result || result.length == 0) {
      error = new Error("Cannot get all dorm")
      error.status = 500
      throw error
    } else {
      res.status(200).json({ results: result.rows, totalPage: Math.ceil(result.count / limit) })
    }
  } catch (err) {
    next(err)
  }
})

//get all owner dorm
router.get('/owner', async (req, res, next) => {
  try {
    const pageasNumber = parseInt(req.query.page)
    const limitasNumber = parseInt(req.query.limit)
    const dormIdList = req.query.dormIdList
    console.log(dormIdList)

    let page = 0
    if (!isNaN(pageasNumber) && pageasNumber > 0) {
      page = pageasNumber
    }

    let limit = 20

    if (!isNaN(limitasNumber) && limitasNumber > 0) {
      limit = limitasNumber
    }
    let result = await dorm.findAndCountAll({
      limit: limit,
      offset: page * limit,
      distinct: true,
      where: {
        dormId: {
          [Op.in]: dormIdList,
        }
      },
      include: [{
        model: address,
        attributes: ['number', 'street', 'alley'],
        include: {
          model: subDistricts,
          attributes: ['name_th', 'zip_code'],
          include: {
            model: districts,
            attributes: ['name_th'],
            include: {
              model: provinces,
              attributes: ['name_th', 'img'],
              include: {
                model: geographies,
                attributes: ['name']
              }
            }
          }
        }
      }, { model: roomType, through: { attributes: ['price', 'area', 'deposit'] } }, room, { model: userAccount, attributes: ['fname', 'lname', 'email', 'phone'] }, media, { model: bankAccount, attributes: ['accountNum', 'accountName', 'qrcode'] }
      ]
    })
    if (!result || result.length == 0) {
      error = new Error("Cannot get all dorm")
      error.status = 500
      throw error
    } else {
      res.status(200).json({ results: result.rows, totalPage: Math.ceil(result.count / limit) })
    }
  } catch (err) {
    next(err)
  }
})

//get dorm by dormId
router.get('/:dormId', async (req, res, next) => {
  try {
    if (!(isNaN(parseInt(req.params.dormId)))) {
      result = await dorm.findOne({
        where: { dormId: req.params.dormId },
        include: [{
          model: address,
          attributes: ['number', 'street', 'alley'],
          include: {
            model: subDistricts,
            attributes: ['name_th', 'zip_code'],
            include: {
              model: districts,
              attributes: ['name_th'],
              include: {
                model: provinces,
                attributes: ['name_th', 'img'],
                include: {
                  model: geographies,
                  attributes: ['name']
                }
              }
            }
          }
        }, { model: roomType, through: { attributes: ['price', 'area', 'deposit'] }, }, room, { model: userAccount, attributes: ['fname', 'lname', 'email', 'phone'] }, media, { model: bankAccount, attributes: ['accountNum', 'accountName', 'qrcode'] }
        ]
      })
    } else {
      error = new Error('request param value type not correct')
      error.status = 403
      throw error
    }
    if (!result) {
      error = new Error('Cannot get dorm')
      error.status = 500
      throw error
    } else {
      res.status(200).json(result)
    }
  } catch (err) {
    next(err)
  }
})


//Add new dorm
router.post('/register', [upload, jwt.authenticateToken], async (req, res, next) => {
  let files = req.files
  try {
    newData = JSON.parse(req.body.data);
    let newroomType = []
    let roomData = []
    let new_dormId
    let medias = []
    let result = await sequelize.transaction(async (t) => {
      //Check for userAccount
      await userAccount.findOne({ where: { userId: req.userId } }).then(findUserAccount => {
        if (findUserAccount.role != "Owner") {
          error = new Error('This account cannot access')
          error.status = 403
          throw error
        }
      })
      //Check for existed dorm
      await dorm.findAll({ include: [address] }).then(findDorm => {
        for (let i in findDorm) {
          if (findDorm[i].name == newData.dorm.name) {
            error = new Error('Dorm name is existed')
            error.status = 403
            throw error
          }
          if (findDorm[i].address.number == newData.address.number && findDorm[i].address.street == newData.address.street && findDorm[i].address.alley == newData.address.allay) {
            error = new Error('address is existed')
            error.status = 403
            throw error
          }
        }
      })
      //Create new address
      let findsubDistrictId = await subDistricts.findOne({
        attributes: ['subDistrictsId'], where: { [Op.and]: { zip_code: newData.address.zipCodeId, name_th: newData.address.subDistrict } }
      })
      if (findsubDistrictId == null || findsubDistrictId == undefined) {
        error = new Error('address is not found')
        error.status = 403
        throw error
      }
      await address.create({
        number: newData.address.number,
        street: newData.address.street,
        alley: newData.address.alley,
        subDistrictId: findsubDistrictId.subDistrictsId
      }, { transaction: t }).then(async new_address => {
        if (new_address == null || new_address == undefined) {
          error = new Error('Insert address fail')
          error.status = 500
          throw error
        } else {
          //Create new dorm
          await dorm.create({
            name: newData.dorm.name,
            openTime: newData.dorm.openTime,
            closeTime: newData.dorm.closeTime,
            description: newData.dorm.description,
            rating: newData.dorm.rating,
            acceptPercent: newData.dorm.acceptPercent,
            elecPerUnit: newData.dorm.elecPerUnit,
            waterPerUnit: newData.dorm.waterPerUnit,
            addressId: new_address.addressId,
            ownerId: req.userId
          }, { transaction: t }).then(new_dorm => {
            if (new_dorm == null || new_dorm == undefined) {
              error = new Error('Insert dorm fail')
              error.status = 500
              throw error
            } else {
              new_dormId = new_dorm.dormId
            }
          })
        }
      })
      //Check for existed roomtype in request
      for (let i in newData.roomType) {
        let existRoomtype;
        if (newData.roomType[i].type != null) {
          if (existRoomtype == newData.roomType[i].type) {
            error = new Error(`roomType Duplicate : ${existRoomtype}`)
            error.status = 403
            throw error
          } else {
            existRoomtype = newData.roomType[i].type
          }
        } else {
          error = new Error('input roomType is null')
          error.status = 403
          throw error
        }
      }
      for (let i in newData.roomType) {
        //Create new roomType
        await roomType.create({ type: newData.roomType[i].type, description: newData.roomType[i].description }, { transaction: t }).then(async roomtype => {
          if (roomtype == null || roomtype == undefined) {
            error = new Error('insert roomType is null')
            error.status = 403
            throw error
          } else {
            //Create new dormHasRoomType
            await dormHasRoomType.create({
              dormId: new_dormId,
              roomTypeId: roomtype.roomTypeId,
              price: newData.roomType[i].price,
              deposit: newData.roomType[i].deposit,
              area: newData.roomType[i].area
            }, { transaction: t })
            newroomType.push({ roomTypeId: roomtype.roomTypeId, type: roomtype.type })
          }
        })
      }

      files.forEach(async (file) => {
        if (file.fieldname.includes("dorm_")) {
          if (file.fieldname.includes("roomType")) {
            for (let i in newroomType) {
              if (newroomType[i].type.toLowerCase() == file.fieldname.substr(14).toLowerCase()) {
                medias.push({
                  path: file.path,
                  name: file.fieldname,
                  dormId: new_dormId,
                  roomTypeId: newroomType[i].roomTypeId
                })
              }
            }
          } else {
            medias.push({
              path: file.path,
              name: file.fieldname,
              dormId: new_dormId,
              roomTypeId: null
            })
          }
        }
      });
      if (medias.length == 0) {
        error = new Error("No media for insert")
        error.status = 500
        throw error
      } else {
        //Create new media
        media.bulkCreate(medias, { transaction: t })
      }

      for (let i in newData.room) {
        if (newData.room[i].roomType == null || newData.room[i].roomType == undefined) {
          error = new Error("Input roomtype of room error")
          error.status = 403
          throw error
        } else {
          for (let j in newroomType) {
            if (newroomType[j].type == newData.room[i].roomType) {
              roomData.push({
                roomNum: newData.room[i].roomNum,
                status: newData.room[i].status,
                floors: newData.room[i].floors,
                description: newData.room[i].description,
                dormId: new_dormId,
                roomTypeId: newroomType[j].roomTypeId
              })
            }
          }
        }
      }
      //Create new room
      await room.bulkCreate(roomData, { transaction: t })

      //Create payment method
      let bankAccountList = []
      for (let i in newData.bankAccount) {
        if (func.checkForEmptyString(newData.bankAccount[i].accountNum) || func.checkForEmptyString(newData.bankAccount[i].accountName || _.isNull(newData.bankAccount[i].bankId) || _.isNumber(newData.bankAccount[i].bankId))) {
          error = new Error("Input bankAccount error")
          error.status = 403
          throw error
        } else {
          files.forEach(async (file) => {
            if (file.fieldname.includes("dorm_")) {
              if (file.fieldname.includes("bankAccount")) {
                if (_.isEqual(_.lowerCase(newData.bankAccount[i].accountName), _.lowerCase(file.fieldname.substr(17)))) {
                  bankAccountList.push({
                    accountNum: newData.bankAccount[i].accountNum,
                    accountName: newData.bankAccount[i].accountName,
                    qrcode: file.path,
                    dormId: new_dormId,
                    bankId: newData.bankAccount[i].bankId
                  })
                }
              }
            }
          });
          if (_.isUndefined(_.find(bankAccountList, {
            accountNum: newData.bankAccount[i].accountNum,
            accountName: newData.bankAccount[i].accountName, bankId: newData.bankAccount[i].bankId
          }))) {
            bankAccountList.push({
              accountNum: newData.bankAccount[i].accountNum,
              accountName: newData.bankAccount[i].accountName,
              qrcode: "",
              dormId: new_dormId,
              bankId: newData.bankAccount[i].bankId
            })
          }
        }
      }
      await bankAccount.bulkCreate(bankAccountList, { transaction: t })
    })
    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    files.forEach(async (file) => {
      fs.unlinkSync(file.path)
    })
    next(err)
  }
})

//delete dorm by dormId
router.delete('/:dormId', async (req, res, next) => {
  id = req.params.dormId
  try {
    await sequelize.transaction(async (t) => {
      //Check for dorm
      deleteDorm = await dorm.findOne({ where: { dormId: id }, include: [address, bankAccount, roomType, room, media] })
      if (deleteDorm == null || deleteDorm == undefined) {
        throw new Error('Dorm Not Found')
      }
      if (deleteDorm.bankAccounts.length == 0 || deleteDorm.bankAccounts.length == undefined) {
        throw new Error('bankAccount Not Found')
      } else {
        await bankAccount.destroy({ where: { dormId: id }, transaction: t })
      }
      if (deleteDorm.roomTypes.length == 0 || deleteDorm.roomTypes.length == undefined) {
        throw new Error('roomtype Not Found')
      }
      if (deleteDorm.rooms.length == 0 || deleteDorm.rooms.length == undefined) {
        throw new Error('rooms Not Found')
      } else {
        await room.destroy({ where: { dormId: id }, transaction: t })
      }
      if (deleteDorm.media.length == 0 || deleteDorm.media.length == undefined) {
        throw new Error('media Not Found')
      } else {
        for (let i in deleteDorm.media) {
          try {
            fs.unlinkSync(deleteDorm.media[i].path)
          } catch (err) {
            continue;
          }
        }
        await media.destroy({ where: { dormId: id }, transaction: t })
      }
      for (let i in deleteDorm.roomTypes) {
        if (deleteDorm.roomTypes[i].dormHasRoomType == null || deleteDorm.roomTypes[i].dormHasRoomType == undefined) {
          throw new Error('dormHasRoomType Not Found')
        }
        await deleteDorm.removeRoomTypes(deleteDorm.roomTypes[i], { transaction: t })
        await deleteDorm.roomTypes[i].destroy({ transaction: t })
      }
      await deleteDorm.destroy({ transaction: t })
      await address.destroy({ where: { addressId: deleteDorm.addressId }, transaction: t })
    })
    res.sendStatus(200)
  } catch (err) {
    console.log(err)
    next(err)
  }
})


router.put('/edit', upload, async (req, res, next) => {
  let editData = JSON.parse(req.body.data)
  try {
    if (editData.dormId != null || editData.dormId != '' || editData.dormId != 0) {
      //Edit Dorm
      if (editData.dorm != null || editData.dorm != undefined) {
        await dorm.update(editData.dorm, {
          where: { dormId: editData.dormId }
        })
      }
      //Edit Address
      if (editData.address != null || editData.address != undefined) {
        let findsubDistrictId = await subDistricts.findOne({
          attributes: ['subDistrictsId'], where: { [Op.and]: { zip_code: editData.address.zipCodeId, name_th: editData.address.subDistrict } }
        })
        if (findsubDistrictId == null || findsubDistrictId == undefined) {
          error = new Error('address is not found')
          error.status = 403
          throw error
        }
        let addressId = await dorm.findOne({ attributes: ['addressId'], where: { dormId: editData.dormId } })
        let editAddress = {
          number: editData.address.number,
          street: editData.address.street,
          alley: editData.address.alley,
          subDistrictId: findsubDistrictId.subDistrictsId
        }
        await address.update(editAddress, {
          where: { addressId: addressId.addressId }
        })
      }
      //Edit RoomType
      if (editData.roomTypes != null || editData.roomTypes != undefined) {
        for (let i in editData.roomTypes) {
          console.log(editData.roomTypes[i].type)
          await roomType.update({
            type: editData.roomTypes[i].type,
            description: editData.roomTypes[i].description
          }, {
            where: { roomTypeId: editData.roomTypes[i].roomTypeId }
          })
          await dormHasRoomType.update({
            price: editData.roomTypes[i].price,
            area: editData.roomTypes[i].area,
            deposit: editData.roomTypes[i].deposit
          }, {
            where: { [Op.and]: [{ roomTypeId: editData.roomTypes[i].roomTypeId }, { dormId: editData.dormId }] }
          })
        }
      }
      res.sendStatus(200)
    } else {
      error = new Error("No media for insert")
      error.status = 500
      throw error
      // res.sendStatus(400).send('dormId not found')
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
})

router.post('/booking', upload, async (req, res, next) => {
  let data = JSON.parse(req.body.data)
  try {
    await sequelize.transaction(async (t) => {
      //Check for booking
      await room.findOne({ attributes: ['status'] ,where: { roomId: data.roomId } }, { transaction: t }).then(findRoom => {
        if (findRoom == undefined || findRoom.status == "booking") {
          error = new Error("Cannot booking this room")
          error.status = 403
          throw error
        }
      })
      await booking.findOne({where: {roomId: data.roomId}}, { transaction: t }).then(findBooking => {
        if(findBooking != undefined || findBooking != null){
          error = new Error("This room already booking")
          error.status = 403
          throw error
        }
      })

      //Check for customer role
      await userAccount.findOne({ attributes: ['role'] ,where: { userId: data.userId } }, { transaction: t }).then(findUser => {
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
        if(findRoom == undefined || findRoom == null){
          error = new Error("This room not right")
          error.status = 403
          throw error
        }
      })

      //Create booking table
      await booking.create({
        payDate: "",
        startDate: "",
        endDate: "",
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