module.exports = (sequelize, DataTypes) => {
  const media = sequelize.define(
    'media', {
      mediaId: {
        type: DataTypes.STRING(5),
        primaryKey: true,
        field: 'mediaId'
      },
      path: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        field: 'path'
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'name'
      }
    }, {
      tableName: 'media'
    }
  );

  return media;
}