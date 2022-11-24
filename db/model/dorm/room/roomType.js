module.exports = (sequelize, DataTypes) => {
  const roomType = sequelize.define(
    'roomType', {
      roomTypeId: {
        type: DataTypes.INTEGER(5),
        primaryKey: true,
        autoIncrement: true,
        field: 'roomTypeId'
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'type'
      },
      description:{
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: 'description'
      }
    }, {
      tableName: 'roomType'
    }
  );

  return roomType;
}