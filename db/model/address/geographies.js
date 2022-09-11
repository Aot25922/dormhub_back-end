module.exports = (sequelize, DataTypes) => {
  const geographies = sequelize.define(
    'geographies', {
      geographiesId: {
        type: DataTypes.INTEGER(1),
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'name'
      }
    }, {
      tableName: 'geographies'
    }
  );

  return geographies;
}