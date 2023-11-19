module.exports = {
    HOST: "localhost",
    USER: "goku",
    PASSWORD: "Goku100!",
    DB: "conversewall",
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};