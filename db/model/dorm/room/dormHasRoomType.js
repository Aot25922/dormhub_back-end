module.exports = (sequelize, DataTypes) => {
    const dormHasRoomType = sequelize.define(
      'dormHasRoomType', {
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'price'
        },
        area: {
          type: DataTypes.DECIMAL(5,2),
          allowNull: false,
          field: 'area'
        },
        deposit: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'deposit'
        }
      }, {
        tableName: 'dormHasRoomType'
      }
    );
  
    return dormHasRoomType;
  }