module.exports = (sequelize, DataTypes) => {
  const subDistrict = sequelize.define(
    'subDistrict', {
      subDistrictId: {
        type: DataTypes.INTEGER(4),
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
        allowNull: false,
        field: 'zipCodeId'
      },
      districtId: {
        type: DataTypes.STRING(5),
        allowNull: false,
        field: 'districtId'
      }
    }, {
      tableName: 'subDistrict'
    }
  );

  return subDistrict;
}