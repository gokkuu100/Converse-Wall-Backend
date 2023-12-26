
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
    return Message;
};
