const { parse } = require('dotenv');
const db = require('../db/index')
const { subDistrict, address, province, region, booking, userAccount, bank, bankAccount, detail, room, roomType, dorm, media, district } = db;

async function addressIdGenerator() {
    data = await address.findAll({
        attributes: ['addressId'],
        order: [
            ['addressId', 'DESC']
        ],
        limit: 1
    })
    data = parseInt(data[0].addressId) + 1
    return data
}

async function dormIdGenerator() {
    data = await dorm.findAll({
        attributes: ['dormId'],
        order: [
            ['dormId', 'DESC']
        ],
        limit: 1
    })
    data = parseInt(data[0].dormId) + 1
    return data
}

async function roomIdGenerator() {
    data = await room.findAll({
        attributes: ['roomId'],
        order: [
            ['roomId', 'DESC']
        ],
        limit: 1
    })
    data = parseInt(data[0].addressId) + 1
    return data
}

async function mediaIdGenerator() {
    data = await room.findAll({
        attributes: ['mediaId'],
        order: [
            ['mediaId', 'DESC']
        ],
        limit: 1
    })
    data = parseInt(data[0].addressId) + 1
    return data
}
module.exports = { addressIdGenerator, dormIdGenerator, roomIdGenerator, mediaIdGenerator }