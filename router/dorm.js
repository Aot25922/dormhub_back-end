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
        }, { model: roomType }]
    })
    res.json(result)
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
    res.json(result)
  } catch (err) {
    res.json(err)
  }
})

router.post('/register', async (req, res) => {
  newData = req.body.data;
  console.log(newData)
  new_dormId = await func.dormIdGenerator()
  new_addressId = await func.addressIdGenerator()
  try{
  await address.create({
    addressId : new_addressId,
    number: newData.address.number,
    street: newData.address.street,
    alley: newData.address.alley,
    subDistrictId:1
  })
  await dorm.create({
    dormId: new_dormId,
    name: newData.dorm.name,
    openTime: newData.dorm. openTime,
    closeTime: newData.dorm.closeTime,
    description: newData.dorm.description,
    rating: newData.dorm.rating,
    acceptPercent: newData.dorm.acceptPercent,
    elecPerUnit: newData.dorm.elecPerUnit,
    waterPerUnit: newData.dorm.waterPerUnit,
    addressId: new_addressId
  })
  res.status(500)
}catch(err){
  console.log(err)
}
})

router.delete('/:dormId', async (req, res) => {
  id = req.params.dormId
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