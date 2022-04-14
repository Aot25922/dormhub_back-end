module.exports = (sequelize, DataTypes) => {
  const subDistrict = sequelize.define(
    'subDistrict', {
      subDistrictId: {
        type: DataTypes.STRING(4),
        primaryKey: true,
        field: 'subDistrictId'
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'name'
      },
      zipcode: {
        type: DataTypes.CHAR(5),
        primaryKey: true,
        field: 'zipcode'
      }
    }, {
      tableName: 'subDistrict'
    }
  );

  return subDistrict;
}