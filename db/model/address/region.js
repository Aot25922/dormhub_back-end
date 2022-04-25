module.exports = (sequelize, DataTypes) => {
  const region = sequelize.define(
    'region', {
      regionId: {
        type: DataTypes.INTEGER(1),
        primaryKey: true,
        field: 'regionId'
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'name'
      }
    }, {
      tableName: 'region'
    }
  );

  return region;
}