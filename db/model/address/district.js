module.exports = (sequelize, DataTypes) => {
  const district = sequelize.define(
    'district', {
      districtId: {
        type: DataTypes.STRING(4),
        primaryKey: true,
        field: 'districtId'
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'name'
      },
    }, {
      tableName: 'district'
    }
  );

  return district;
}