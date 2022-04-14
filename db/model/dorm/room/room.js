module.exports = (sequelize, DataTypes) => {
  const room = sequelize.define(
    'room', {
      roomId: {
        type: DataTypes.STRING(5),
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
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'price'
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'description'
      },
      deposit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'deposit'
      },
    }, {
      tableName: 'room'
    }
  );

  return room;
}