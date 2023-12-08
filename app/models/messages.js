
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("messages", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true,
        },
        messageText: {
            type: DataTypes.STRING(1024),
        }
    });
    
    // foreign key relationships
    Message.belongsTo(sequelize.models.users, { foreignKey: 'senderId', as: 'sender' });
    Message.belongsTo(sequelize.models.users, { foreignKey: 'receiverId', as: 'receiver' });
    
    return Message;
};
