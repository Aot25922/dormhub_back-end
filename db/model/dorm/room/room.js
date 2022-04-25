module.exports = (sequelize, DataTypes) => {
  const room = sequelize.define(
    'room', {
      roomId: {
        type: DataTypes.INTEGER(5),
        primaryKey: true,
        field: 'roomId'
      },
      roomNum: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'roomNum'
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'status'
      },
      floors: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'floors'
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'description'
      }
    }, {
      tableName: 'room'
    }
  );

  return room;
}