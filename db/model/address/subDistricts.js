module.exports = (sequelize, DataTypes) => {
  const subDistricts = sequelize.define(
    'subDistricts', {
      subDistrictsId: {
        type: DataTypes.INTEGER(6),
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      zip_code: {
        type: DataTypes.STRING(5),
        allowNull: false,
        field: 'zip_code'
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
      districtId: {
        type: DataTypes.INTEGER(6),
        allowNull: false,
        field: 'districts_id'
      }
    }, {
      tableName: 'subDistricts'
    }
  );

  return subDistricts;
}