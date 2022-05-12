module.exports = (sequelize, DataTypes) => {
  const district = sequelize.define(
    'district', {
      districtId: {
        type: DataTypes.INTEGER(4),
        primaryKey: true,
        autoIncrement: true,
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