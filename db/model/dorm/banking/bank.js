module.exports = (sequelize, DataTypes) => {
  const bank = sequelize.define(
    'bank', {
      bankId: {
        type: DataTypes.INTEGER(3),
        primaryKey: true,
        autoIncrement: true,
        field: 'bankId'
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        field: 'name'
      },
      logo: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        field: 'logo'
      }
    }, {
      tableName: 'bank'
    }
  );

  return bank;
}