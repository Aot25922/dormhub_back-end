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
db.subDistricts = require('./model/address/subDistricts')(sequelize, Sequelize)
db.districts = require('./model/address/districts')(sequelize, Sequelize)
db.address = require('./model/address/address')(sequelize, Sequelize)
db.provinces = require('./model/address/provinces')(sequelize, Sequelize)
db.geographies = require('./model/address/geographies')(sequelize, Sequelize)
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
db.geographies.hasMany(db.provinces, {
  foreignKey: {
    name: 'id',
    field: 'geographiesId'
  },
  allowNull: false
})

db.provinces.belongsTo(db.geographies, {
  foreignKey: 'geographiesId'
})

db.provinces.hasMany(db.districts, {
  foreignKey: {
    name: 'provincesId',
    field: 'provincesId'
  },
  allowNull: false
})

db.districts.belongsTo(db.provinces, {
  foreignKey: 'provincesId'
})

db.districts.hasMany(db.subDistricts, {
  foreignKey: {
    name: 'districtsId',
    field: 'districts_Id'
  },
  allowNull: false
})

db.subDistricts.belongsTo(db.districts, {
  foreignKey: 'districtsId'
})

db.subDistricts.hasMany(db.address, {
  foreignKey: {
    name: 'subDistrictsId',
    field: 'subDistrictId'
  },
  allowNull: false
})

db.address.belongsTo(db.subDistricts, {
  foreignKey: 'subDistrictId'
})

db.userAccount.hasMany(db.dorm, {
  foreignKey: {
    name: 'ownerId',
    field: 'ownerId'
  },
  allowNull: false
})
db.dorm.belongsTo(db.userAccount, {
  foreignKey: 'ownerId',
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