const { Sequelize , DataTypes } = require('sequelize');

// ใช้เชื่อมต่อ DB
const sequelize = new Sequelize(
  'int365_dormhub', 
  'int365', 
  '9Q7@e4>+#p;+LHpYd_GU2Y$.a?\\uhCg*', 
  {
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
db.zipcode = require('./model/address/zipcode')(sequelize,DataTypes)
db.subDistrict = require('./model/address/subDistrict')(sequelize,DataTypes)
db.district = require('./model/address/district')(sequelize,DataTypes)
db.address = require('./model/address/address')(sequelize,DataTypes)
db.province = require('./model/address/province')(sequelize,DataTypes)
db.region = require('./model/address/region')(sequelize,DataTypes)


//เชื่อมความสัมพันธ์
db.subDistrict.hasMany(db.address,{foreignKey : 'subDistrictId'})
db.address.belongsTo(db.subDistrict,{foreignKey:'subDistrictId'})

db.district.hasMany(db.subDistrict,{foreignKey:'districtId'})
db.subDistrict.belongsTo(db.district,{foreignKey:'districtId'})

db.province.hasMany(db.district,{foreignKey : 'provinceId'})
db.district.belongsTo(db.province,{foreignKey : 'provinceId'})

db.region.hasMany(db.province,{foreignKey : 'regionId'})
db.province.belongsTo(db.region,{foreignKey : 'regionId'})
module.exports = db;