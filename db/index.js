const {
  Sequelize,
  DataTypes
} = require('sequelize');

// ใช้เชื่อมต่อ DB
const sequelize = new Sequelize(
  'int365_dormhub',
  'int365',
  '9Q7@e4>+#p;+LHpYd_GU2Y$.a?\\uhCg*', {
    host: 'bom2321.thddns.net',
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

// ใช้ Summon Model ที่เราสร้างเเละใส่(sequelize {เพื่อระบุ DB ที่ใช้อ้างอิง} ,DataTypes {ใช้ระบุประเภทข้อมูลใน Model})
db.subDistrict = require('./model/address/subDistrict')(sequelize, DataTypes)
db.district = require('./model/address/district')(sequelize, DataTypes)
db.address = require('./model/address/address')(sequelize, DataTypes)
db.province = require('./model/address/province')(sequelize, DataTypes)
db.region = require('./model/address/region')(sequelize, DataTypes)
db.booking = require('./model/dorm/account/booking')(sequelize, DataTypes)
db.userAccount = require('./model/dorm/account/userAccount')(sequelize, DataTypes)
db.bank = require('./model/dorm/banking/bank')(sequelize, DataTypes)
db.bankAccount = require('./model/dorm/banking/bankAccount')(sequelize, DataTypes)
db.detail = require('./model/dorm/room/detail')(sequelize, DataTypes)
db.room = require('./model/dorm/room/room')(sequelize, DataTypes)
db.roomType = require('./model/dorm/room/roomType')(sequelize, DataTypes)
db.dorm = require('./model/dorm/dorm')(sequelize, DataTypes)
db.media = require('./model/dorm/media')(sequelize, DataTypes)

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

db.address.hasMany(db.userAccount, {
  foreignKey: {
    name: 'addressId',
    field: 'addressId'
  },
  allowNull: false
})
db.userAccount.belongsTo(db.address, {
  foreignKey: 'addressId'
})

db.userAccount.hasMany(db.dorm, {
  foreignKey: {
    name: 'ownerId',
    field: 'ownerId'
  }
})
db.dorm.belongsTo(db.userAccount, {
  foreignKey: 'ownerId'
})

db.dorm.hasOne(db.address, {
  foreignKey: {
    name: 'addressId',
    field: 'addressId'
  },
  allowNull: false
})
db.address.belongsTo(db.dorm, {
  foreignKey: 'addressId'
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

db.booking.hasMany(db.room,{
  foreignKey:{
    name:'bookingId',
    field:'bookingId'
  }
})
db.room.belongsTo(db.booking,{
  foreignKey:'aggreementId'
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

db.roomType.belongsToMany(db.detail,{
  through: 'roomDetail',
  foreignKey:'roomTypeId',
  otherKey:'detailId'
})
db.detail.belongsToMany(db.roomType,{
  through: 'roomDetail',
  foreignKey:'detailId',
  otherKey:'roomTypeId'
})

module.exports = db;