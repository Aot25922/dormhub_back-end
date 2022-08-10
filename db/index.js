require('dotenv').config();
const {
  Sequelize,
  DataTypes,
  QueryTypes,
  Op
} = require('sequelize');

// ใช้เชื่อมต่อ DB
const sequelize = new Sequelize(
  'int365_dormhub',
  'int365',
  '9Q7@e4>+#p;+LHpYd_GU2Y$.a?\\uhCg*', {
    host: process.env.Database_URL || 'mysql.dormhub.works',
    port: process.env.Database_Port || '33306',
    dialect: 'mysql',
    define: {
      timestamps: false
    },
    pool: {
      max: 50,
      min: 0,
      idle: 10000
    }
  });

const db = {};
db.sequelize = sequelize;
db.DataTypes = DataTypes;
db.Sequelize = Sequelize;
db.Op = Op;
db.QueryTypes = QueryTypes;

// ใช้ Summon Model ที่เราสร้างเเละใส่(sequelize {เพื่อระบุ DB ที่ใช้อ้างอิง} ,DataTypes {ใช้ระบุประเภทข้อมูลใน Model})
db.subDistrict = require('./model/address/subDistrict')(sequelize, Sequelize)
db.district = require('./model/address/district')(sequelize, Sequelize)
db.address = require('./model/address/address')(sequelize, Sequelize)
db.province = require('./model/address/province')(sequelize, Sequelize)
db.region = require('./model/address/region')(sequelize, Sequelize)
db.booking = require('./model/dorm/account/booking')(sequelize, Sequelize)
db.userAccount = require('./model/dorm/account/userAccount')(sequelize, Sequelize)
db.bank = require('./model/dorm/banking/bank')(sequelize, Sequelize)
db.bankAccount = require('./model/dorm/banking/bankAccount')(sequelize,Sequelize)
db.room = require('./model/dorm/room/room')(sequelize, Sequelize)
db.roomType = require('./model/dorm/room/roomType')(sequelize, Sequelize)
db.dorm = require('./model/dorm/dorm')(sequelize, Sequelize)
db.media = require('./model/dorm/media')(sequelize, Sequelize)
db.dormHasRoomType = require('./model/dorm/room/dormHasRoomType')(sequelize,Sequelize)

//เชื่อมความสัมพันธ์
db.subDistrict.hasMany(db.address, {
  foreignKey: {
    name: 'subDistrictId',
    field: 'subDistrictId'
  },
  allowNull: false
})
db.address.belongsTo(db.subDistrict, {
  foreignKey: 'subDistrictId'
})

db.district.hasMany(db.subDistrict, {
  foreignKey: {
    name: 'districtId',
    field: 'districtId'
  },
  allowNull: false
})
db.subDistrict.belongsTo(db.district, {
  foreignKey: 'districtId'
})

db.province.hasMany(db.district, {
  foreignKey: {
    name: 'provinceId',
    field: 'provinceId'
  },
  allowNull: false
})
db.district.belongsTo(db.province, {
  foreignKey: 'provinceId'
})

db.region.hasMany(db.province, {
  foreignKey: {
    name: 'regionId',
    field: 'regionId'
  },
  allowNull: false
})
db.province.belongsTo(db.region, {
  foreignKey: 'regionId'
})

db.address.hasOne(db.userAccount, {
  foreignKey: {
    name: 'addressId',
    field: 'addressId'
  }
})
db.userAccount.belongsTo(db.address, {
  foreignKey: 'addressId'
})

db.userAccount.belongsToMany(db.dorm, {
  through: 'dormHasOwner',
  foreignKey: 'dormId',
  // otherKey: 'ownId'
})
db.dorm.belongsToMany(db.userAccount, {
  through: 'dormHasOwner',
  foreignKey: 'ownerId',
  // otherKey: 'dormId'
})

db.dorm.belongsTo(db.address,{
  foreignKey: 'addressId'
}
)
db.address.hasOne(db.dorm, {
  foreignKey: {
    name: 'addressId',
    field:'addressId',
    allowNull: false
  }
})

db.dorm.hasMany(db.bankAccount, {
  foreignKey: {
    name: 'dormId',
    field: 'dormId'
  },
  allowNull: false
})
db.bankAccount.belongsTo(db.dorm, {
  foreignKey: 'dormId'
})

db.bank.hasMany(db.bankAccount, {
  foreignKey: {
    name: 'bankId',
    field: 'bankId'
  },
  allowNull: false
})
db.bankAccount.belongsTo(db.bank, {
  foreignKey: 'bankId'
})

db.userAccount.hasMany(db.booking,{
  foreignKey:{
    name:'userId',
    field:'userId'
  }
})
db.booking.belongsTo(db.userAccount,{
  foreignKey:'userId'
})

db.dorm.hasMany(db.media,{
  foreignKey:{
    name:'dormId',
    field:'dormId'
  },
  allowNull:false
})
db.media.belongsTo(db.dorm,{
  foreignKey:'dormId'
})

db.dorm.hasMany(db.room,{
  foreignKey:{
    name:'dormId',
    field:'dormId'
  },
  allowNull:false
})
db.room.belongsTo(db.dorm,{
  foreignKey:'dormId'
})

db.room.hasOne(db.booking,{
  foreignKey:{
    name:'roomId',
    field:'roomId'
  }
})
db.booking.belongsTo(db.room,{
  foreignKey:'roomId'
})

db.roomType.hasMany(db.media,{
  foreignKey:{
    name:'roomTypeId',
    field:'roomTypeId'
  }
})
db.media.belongsTo(db.roomType,{
  foreignKey:'roomTypeId'
})

db.roomType.hasMany(db.room,{
  foreignKey:{
    name:'roomTypeId',
    field:'roomTypeId'
  }
})
db.room.belongsTo(db.roomType,{
  foreignKey:'roomTypeId'
})

db.bankAccount.hasMany(db.booking,{
  foreignKey:{
    name:'bankAccId',
    field:'bankAccId'
  }
})
db.booking.belongsTo(db.bankAccount,{
  foreignKey : 'bankAccId'
})

db.dorm.belongsToMany(db.roomType,{
  through: db.dormHasRoomType,
  foreignKey: 'dormId',
  otherKey: 'roomTypeId',
})
db.roomType.belongsToMany(db.dorm,{
  through: db.dormHasRoomType,
  foreignKey: 'roomTypeId',
  otherKey: 'dormId',
})

module.exports = db;