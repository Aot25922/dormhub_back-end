module.exports = (sequelize, DataTypes) => {
  const roomType = sequelize.define(
    'roomType', {
      roomTypeId: {
        type: DataTypes.INTEGER(5),
        primaryKey: true,
        field: 'roomTypeId'
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'type'
      }
    }, {
      tableName: 'roomType'
    }
  );

  return roomType;
}