module.exports = (sequelize, DataTypes) => {
  const bankAccount = sequelize.define(
    'bankAccount', {
      bankAccId: {
        type: DataTypes.INTEGER(3),
        primaryKey: true,
        autoIncrement: true,
        field: 'bankAccId'
      },
      accountNum: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        field: 'accountNum'
      },
      accountName:{
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'accountName'
      },
      qrcode: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: 'qrcode'
      }
    }, {
      tableName: 'bankAccount'
    }
  );

  return bankAccount;
}