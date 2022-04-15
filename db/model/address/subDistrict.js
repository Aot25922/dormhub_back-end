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
      zipCodeId: {
        type: DataTypes.CHAR(5),
        primaryKey: true,
        field: 'zipCodeId'
      }
    }, {
      tableName: 'subDistrict'
    }
  );

  return subDistrict;
}