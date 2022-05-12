var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router()
const db = require('../db/index')
const func = require('../function/function')
const multer = require('../middleware/multer')
const upload = multer.upload
const { subDistrict, address, province, region, userAccount, facility, room, roomType, dorm, media, district, dormHasRoomType, Op, sequelize, QueryTypes } = db;
var mime = {
  jpg: 'image/jpeg',
  png: 'image/png',
};
db.sequelize.sync();
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

// router.post('/image', upload.any(), async (req, res, next) => {
//   let files = req.files
//   let dormResult = await dorm.findOne({ where: { name: newData.dorm.name } })
//   if (dormResult == null) {
//     error = new Error('Dorm not found')
//     error.status = 500
//     throw error
//   }
//   files.forEach(async (file) => {
//     if (file.fieldname.includes("dorm_")) {
//       if (file.fieldname.includes("roomType")) {
//         await roomType.findOne({ where: { type: file.fieldname.substr(14) } }).then(roomtype => {
//           if (roomType != null) {
//             media.create({
//               path: file.path,
//               name: file.fieldname,
//               dormId: dormResult.dormId,
//               roomTypeId: roomtype.roomTypeId
//             })
//           }
//           else {
//             error = new Error('roomType not found')
//             error.status = 500
//             throw error
//           }
//         })
//       } else {
//         await media.create({
//           path: file.path,
//           name: file.fieldname,
//           dormId: dormResult.dormId,
//           roomTypeId: null
//         })
//       }
//     }
//   });
//   res.status(200).send('Bryh')
// })

router.get('/image/:dorm/:media', async (req, res, next) => {
  try {
    var data = await media.findOne({
      where: {
        [Op.and]: [{ mediaId: req.params.media },
        { dormId: req.params.dorm }, { roomTypeId: { [Op.is]: null } }]
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

router.get('/image/:dorm/:media/:roomTypeId', async (req, res, next) => {
  let data;
  try {
    data = await media.findOne({
      where: {
        [Op.and]: [{ mediaId: req.params.media }, { dormId: req.params.dorm },
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

router.get('/', async (req, res, next) => {
  try {
    result = await dorm.findAll({
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
        }, { model: roomType, include: { model: facility } }, room, userAccount, media]
    })
    if (!result || result.length == 0) {
      error = new Error("Cannot get all dorm")
      error.status = 500
      throw error
    } else {
      res.status(200).json(result)
    }
  } catch (err) {
    next(err)
  }
})
router.get('/:dormId', async (req, res, next) => {
  try {
    if (!(isNaN(parseInt(req.params.dormId)))) {
      result = await dorm.findOne({
        where: { dormId: req.params.dormId },
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
        }, { model: roomType, include: { model: facility } }, room, userAccount, media
        ]
      })
    } else {
      error = new Error('requst param value type not correct')
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

router.post('/register', upload.any(), async (req, res, next) => {
  newData = JSON.parse(req.body.data);
  let newroomType = []
  let roomData = []
  let new_dormId
  let medias = []
  try {
    let files = req.files
    await dorm.findOne({ where: { name: newData.dorm.name } }).then(existDorm => {
      if (existDorm != null) {
        error = new Error('Dorm name was existed')
        error.status = 403
        throw error
      }
    })
    await address.findOne({ where: { [Op.and]: [{ number: newData.address.number }, { street: newData.address.street }, { alley: newData.address.alley }] } }).then(existAddress => {
      if (existAddress != null) {
        error = new Error('Address was existed')
        error.status = 403
        throw error
      }
    })
    await address.create({
      number: newData.address.number,
      street: newData.address.street,
      alley: newData.address.alley,
      subDistrictId: newData.address.subDistrictId
    }).then(async new_address => {
      if (new_address == null || new_address == undefined) {
        error = new Error('Insert address fail')
        error.status = 500
        throw error
      } else {
        console.log(new_address)
        await dorm.create({
          name: newData.dorm.name,
          openTime: newData.dorm.openTime,
          closeTime: newData.dorm.closeTime,
          description: newData.dorm.description,
          rating: newData.dorm.rating,
          acceptPercent: newData.dorm.acceptPercent,
          elecPerUnit: newData.dorm.elecPerUnit,
          waterPerUnit: newData.dorm.waterPerUnit,
          addressId: new_address.addressId
        }).then(new_dorm => {
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
      await roomType.create({ type: newData.roomType[i].type, facilities: newData.roomType[i].facility }, { include: [facility] }).then(async roomtype => {
        if (roomtype == null || roomtype == undefined) {
          error = new Error('insert roomType is null')
          error.status = 403
          throw error
        } else {
          await dormHasRoomType.create({
            dormId: new_dormId,
            roomTypeId: roomtype.roomTypeId,
            price: newData.roomType[i].price,
            deposit: newData.roomType[i].deposit,
            area: newData.roomType[i].area
          })
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
    if(medias.length == 0){
      error = new Error("Can't insert media 1")
        error.status = 500
        throw error
    }else{
      media.bulkCreate(medias)
    }
    for (let i in newData.room) {
      if(newData.room[i].roomType == null || newData.room[i].roomType == undefined){
        error = new Error("Input roomtype of room error")
        error.status = 500
        throw error
      }else{
        for (let j in newroomType) {
          if(newroomType[j].type == newData.room[i].roomType){
            roomData.push({
              roomNum: newData.room[i].roomNum,
              status: 'Idle',
              floors: newData.room[i].floors,
              description: newData.room[i].description,
              dormId: new_dormId,
              roomTypeId: newroomType[j].roomTypeId
            })
          }
        }
      }
    }
    await room.bulkCreate(roomData)
    res.status(200).send('success')
  } catch (err) {
    next(err)
    console.log(err)
  }
})


router.delete('/:dormId', async (req, res, next) => {
  id = req.params.dormId
  try {
    await dorm.findOne({ where: { dormId: id } }).then(async deleteDorm => {
      if (deleteDorm == null || deleteDorm == undefined) {
        throw new Error('Dorm Not Found')
      }
    })
    roomtypeid = await dormHasRoomType.findAll({ attributes: ['roomTypeId'], where: { dormId: id } })
    if (roomtypeid.length == 0) {
      throw new Error('roomtypeid Not Found')
    }
    dormhasroomtype = await dormHasRoomType.findAll({ where: { dormId: id } })
    if (dormhasroomtype.length == 0) {
      throw new Error('dormHasRoomType Not Found')
    }
    let facilities = [];
    let roomtypes = [];
    let medias;
    let rooms = [];
    for (let i in roomtypeid) {
      //Find roomType
      await roomType.findOne({ where: { roomtypeId: roomtypeid[i].roomTypeId } }).then(async findroomType => {
        if (findroomType == null || findroomType == undefined) { throw new Error('roomtype Not Found') }
        else {
          //Find facility
          findFacility = await findroomType.getFacilities()
          if (findFacility.length == 0) { throw new Error('roomFacility Not found') }
          await sequelize.query("DELETE FROM roomFacility WHERE roomTypeId = ?", {
            replacements: [findroomType.roomTypeId],
            type: QueryTypes.DELETE
          })
          for (let j in findFacility) {
            await facility.findOne({ where: { facilityId: findFacility[j].facilityId } }).then(fac => {
              if (fac == null || fac == undefined) { throw new Error('Facilities Not found') }
              facilities.push(fac)
            })
          }
          //Find media
          roomtypes.push(findroomType)
        }
      })
    }
    //find media
    medias = await media.findAll({ where: { dormId: id } })
    if (medias.length == 0) { throw new Error('media not found') }
    //Find room
    await room.findAll({ where: { dormId: id } }).then(findRoom => {
      if (findRoom.length == 0) { throw new Error('Room Not Found') }
      for (let i in findRoom) {
        rooms.push(findRoom[i])
      }
    })
    //delete dormhasroomtype
    for (let i in dormhasroomtype) {
      await dormhasroomtype[i].destroy()
    }
    for (let i in rooms) {
      await rooms[i].destroy()
    }
    for (let i in medias) {
      fs.unlinkSync(medias[i].path)
      await medias[i].destroy()
    }
    for (let i in roomtypes) {
     await roomtypes[i].destroy()
    }
    for (let i in facilities) {
      await facilities[i].destroy()
    }
    await dorm.findOne({ where: { dormId: id } }).then(async deleteDorm => {
      if (deleteDorm == null || deleteDorm == undefined) {
        throw new Error('Dorm Not Found')
      }
      await address.findOne({ where: { addressId: deleteDorm.addressId } }).then(async deleteAddress => {
        if (deleteAddress == null || deleteAddress == undefined) { throw new Error('Address Not Found') }
        await deleteDorm.destroy()
        await deleteAddress.destroy()
      })
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }


})

router.put('/edit', async (req, res) => {
  editData = req.body.data
  if (editData.dormId != null || editData.dormId != '' || editData.dormId != 0) {
    if (editData.dorm != null || editData.dorm != undefined) {
      await dorm.update(editData.dorm, {
        where: { dormId: editData.dormId }
      })
    }
    if (editData.address != null || editData.address != undefined) {
      await address.update(editData.address, {
        where: { addressId: editData.address.addressId }
      })
    }
    // if(editData.roomType)
  } else {
    res.sendStatus(400).send('dormId not found')
  }
})


module.exports = router