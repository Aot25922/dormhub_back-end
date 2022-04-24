module.exports = (sequelize, DataTypes) => {
  const facility = sequelize.define(
    'facility', {
      facilityId: {
        type: DataTypes.STRING(5),
        primaryKey: true,
        field: 'facilityId'
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'name'
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'description'
      }
    }, {
      tableName: 'facility'
    }
  );

  return facility;
}