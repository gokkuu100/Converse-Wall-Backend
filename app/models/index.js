const dbConfig = require('../config/dbconfig');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

// test connection
sequelize.authenticate()
.then(() => {
    console.log("Connection has been established successfully.");
})
.catch(err => {
    console.error("Unable to connect to the database:", err);
})

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./users')(sequelize, Sequelize);
db.messages = require('./messages')(sequelize, Sequelize);

// establish associations
db.users.hasMany(db.messages, { as: "senderMessages", foreignKey: "senderId" });
db.users.hasMany(db.messages, { as: "receiverMessages", foreignKey: "receiverId"});
db.messages.belongsTo(db.users, { foreignKey: "senderId", as: "senderUser" });
db.messages.belongsTo(db.users, { foreignKey: "receiverId", as: "receiverUser" });

module.exports = db;