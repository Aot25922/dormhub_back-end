module.exports = (sequelize,DataTypes) => {
  const address = sequelize.define(
    'address', {
      addressId: {
        type: DataTypes.INTEGER(6),
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'number'
      },
      street: {
        type: DataTypes.STRING(30),
        allowNull: false,
        field: 'street'
      },
      alley: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'alley'
      },
      subDistrictId:{
        type : DataTypes.STRING(4),
        allowNull: false,
        field: 'subDistrict_id'
      }
    }, {
      tableName: 'address'
    }
  );

  return address;
}