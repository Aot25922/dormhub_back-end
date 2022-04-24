module.exports = (sequelize,DataTypes) => {
  const address = sequelize.define(
    'address', {
      addressId: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        field: 'addressId'
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
        field: 'subDistrictId'
      }
    }, {
      tableName: 'address'
    }
  );

  return address;
}