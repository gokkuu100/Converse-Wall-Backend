module.exports = ({ users, messages, images }) => {
    users.hasMany(messages, { as: "senderMessages", foreignKey: "senderId" });
    users.hasMany(messages, { as: "receiverMessages", foreignKey: "receiverId" });
    messages.belongsTo(users, { foreignKey: "senderId", as: "senderUser" });
    messages.belongsTo(users, { foreignKey: "receiverId", as: "receiverUser" });

    users.hasMany(images, { as: "senderImages", foreignKey: "senderId" });
    users.hasMany(images, { as: "receiverImages", foreignKey: "receiverId" });
    images.belongsTo(users, { foreignKey: "senderId", as: "senderUser" });
    images.belongsTo(users, { foreignKey: "receiverId", as: "receiverUser" });
};
