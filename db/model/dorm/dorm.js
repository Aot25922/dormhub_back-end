module.exports = (sequelize,DataTypes) => {
  const dorm = sequelize.define(
    'dorm', {
      dormId: {
        type: DataTypes.INTEGER(5),
        primaryKey: true,
        autoIncrement: true,
        field: 'dormId'
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'name'
      },
      openTime: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: 'openTime'
      },
      closeTime: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: 'closeTime'
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'description'
      },
      elecPerUnit: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        field: 'elecPerUnit'
      },
      waterPerUnit: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        field: 'waterPerUnit'
      },
          address: {
          type: DataTypes.STRING(200),
              field: 'address'
          },
    }, {
      tableName: 'dorm'
    }
  );

  return dorm;
}