const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const AuthToken = sequelize.define(
        'AuthToken',
        {
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            idUsuario: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
    );
    return AuthToken;
}