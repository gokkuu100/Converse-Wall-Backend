module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("messages", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Add this line to specify id as the primary key
            autoIncrement: true,
        },
        senderId: {
            type: DataTypes.INTEGER
        },
        receiverId: {
            type: DataTypes.INTEGER
        },
        messageText: {
            type: DataTypes.STRING(1024),
        }
    });
    return Message;
};