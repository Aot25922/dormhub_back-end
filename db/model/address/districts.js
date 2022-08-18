module.exports = (sequelize, DataTypes) => {
  const districts = sequelize.define(
    'districts', {
      districtsId: {
        type: DataTypes.INTEGER(4),
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      code: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        field: 'code'
      },
      name_th: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: 'name_th'
      },
      name_en: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: 'name_en'
      },
      provinceId: {
        type: DataTypes.INTEGER(6),
        allowNull: false,
        field: 'province_id'
      }
    }, {
      tableName: 'districts'
    }
  );

  return districts;
}