module.exports = (sequelize, DataTypes) => {
  const detail = sequelize.define(
    'detail', {
      detailId: {
        type: DataTypes.STRING(5),
        primaryKey: true,
        field: 'detailId'
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
      tableName: 'detail'
    }
  );

  return detail;
}