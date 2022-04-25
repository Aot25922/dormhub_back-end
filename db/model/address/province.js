module.exports = (sequelize, DataTypes) => {
  const province = sequelize.define(
    'province', {
      provinceId: {
        type: DataTypes.INTEGER(2),
        primaryKey: true,
        field: 'provinceId'
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'name'
      },
      img: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        field: 'img'
      }
    }, {
      tableName: 'province'
    }
  );

  return province;
}