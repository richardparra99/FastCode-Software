const { sequelize } = require("../config/config")


const Usuario = require("./usuario.model")(sequelize);
const authToken = require("./authToken.model")(sequelize);


//relaciones 

Usuario.hasMany(authToken, { foreignKey: "idUsuario", as: "authTokens" });
authToken.belongsTo(Usuario, { foreignKey: "idUsuario", as: "usuario" });


module.exports = {
    Usuario,
    authToken,
    sequelize,
    Sequelize: sequelize.Sequelize
}




