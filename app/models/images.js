module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('images', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      image_data: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
      },
    });
    return Image;
  };