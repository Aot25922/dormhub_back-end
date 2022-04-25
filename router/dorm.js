var express = require('express')
var router = express.Router()
const db = require('../db/index')
const func = require('../function/function')
const { subDistrict, address, province, region, booking, userAccount, bank, bankAccount, facility, room, roomType, dorm, media, district, dormHasRoomType } = db;
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
db.sequelize.sync();

router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.get('/', async (req, res) => {
  try {
    result = await dorm.findAll({
      attributes: ['dormId', 'name', 'openTime', 'closeTime', 'rating'],
      include: [
        {
          model: address,
          include: {
            model: subDistrict,
            attributes: ['name', 'zipCodeId'],
            include: {
              model: district,
              attributes: ['name'],
              include: {
                model: province,
                attributes: ['name', 'img'],
                include: {
                  model: region,
                  attributes: ['name']
                }
              }
            }
          }
        }, roomType , room ]
    })
    if (!result) {
      res.status(500).send('Error')
    } else {
      res.status(200).json(result)
    }
  } catch (err) {
    res.json(err)
  }
})
router.get('/:dormId', async (req, res) => {
  try {
    if (req.params != null)
      result = await dorm.findOne({
        where: { dormId: req.params.dormId },
        attributes: ['dormId', 'name', 'openTime', 'closeTime', 'rating'],
        include: [{
          model: address,
          attributes: ['number', 'street', 'alley'],
          include: {
            model: subDistrict,
            attributes: ['name', 'zipCodeId'],
            include: {
              model: district,
              attributes: ['name'],
              include: {
                model: province,
                attributes: ['name', 'img'],
                include: {
                  model: region,
                  attributes: ['name']
                }
              }
            }
          }
        },
        {
          model: roomType,
        }]
      })
    if (!result) {
      res.status(500).send('Error')
    } else {
      res.status(200).json(result)
    }
  } catch (err) {
    res.json(err)
  }
})

router.post('/register', async (req, res) => {
  newData = req.body.data;
  new_dormId = await func.dormIdGenerator()
  new_addressId = await func.addressIdGenerator()
  try {
    await address.create({
      addressId: new_addressId,
      number: newData.address.number,
      street: newData.address.street,
      alley: newData.address.alley,
      subDistrictId: newData.address.subDistrictId
    })
    await dorm.create({
      dormId: new_dormId,
      name: newData.dorm.name,
      openTime: newData.dorm.openTime,
      closeTime: newData.dorm.closeTime,
      description: newData.dorm.description,
      rating: newData.dorm.rating,
      acceptPercent: newData.dorm.acceptPercent,
      elecPerUnit: newData.dorm.elecPerUnit,
      waterPerUnit: newData.dorm.waterPerUnit,
      addressId: new_addressId
    })
    roomtype = []
    dormhasroomtype = []
    for(i in newData.roomType){
      roomtypeid = await func.roomTypeIdGenerator()
       roomtype.push({
        roomTypeId : parseInt(roomtypeid)+parseInt(i),
        type : newData.roomType[i].type
      })
      dormhasroomtype.push({
        dormId:new_dormId,
        roomTypeId:parseInt(roomtypeid)+parseInt(i),
        price:newData.roomType[i].price,
        deposit:newData.roomType[i].deposit,
        area:newData.roomType[i].area
      })
    }
    await roomType.bulkCreate(roomtype)
    await dormHasRoomType.bulkCreate(dormhasroomtype)
    roomData = []
    for(i in newData.room){
      roomid = await func.roomIdGenerator()
      roomtypeid = await roomType.findOne({attributes:['roomTypeId'],where:{type: newData.room[i].roomType}})
      roomData.push({
        roomId : parseInt(roomid)+parseInt(i),
        roomNum:newData.room[i].roomNum,
        status:'Idle',
        floors:newData.room[i].floors,
        description:newData.room[i].description,
        dormId : new_dormId,
        roomTypeId : roomtypeid.roomTypeId
      })
    }
    await room.bulkCreate(roomData)
    res.status(200)
  } catch (err) {
    res.status(500)
    console.log(err)
  }
})

router.delete('/:dormId', async (req, res) => {
  id = req.params.dormId
  await room.destroy({
    where:{dormId: id}
  })
  await dormHasRoomType.destroy({
    where : {dormId: id}
  })
  info = await dorm.destroy({
    where: { dormId: id }
  })
  
  if (!info) {
    res.sendStatus(500);
  } else {
    res.sendStatus(200);
  }
})


module.exports = router