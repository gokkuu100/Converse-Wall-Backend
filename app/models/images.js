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

    // foreign key relationships
    Image.belongsTo(sequelize.models.users, { foreignKey: 'senderId', as: 'sender' });
    Image.belongsTo(sequelize.models.users, { foreignKey: 'receiverId', as: 'receiver' });
        
  
    return Image;
  };