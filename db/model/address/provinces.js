module.exports = (sequelize, DataTypes) => {
  const provinces = sequelize.define(
    'provinces', {
      provincesId: {
        type: DataTypes.INTEGER(2),
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      code: {
        type: DataTypes.INTEGER(2),
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
      img: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: 'img'
      },
      geographyId: {
        type: DataTypes.INTEGER(6),
        allowNull: false,
        field: 'geography_id'
      }
    }, {
      tableName: 'provinces'
    }
  );

  return provinces;
}