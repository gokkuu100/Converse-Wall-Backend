module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Add this line to specify id as the primary key
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
        },
        password: {
            type: DataTypes.STRING(128),
        }
    })
    return User;
}
