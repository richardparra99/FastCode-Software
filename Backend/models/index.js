const { sequelize } = require("../config/config");

// Importar todos los modelos
const Usuario = require("./usuario.model")(sequelize);
const authToken = require("./authToken.model")(sequelize);
const Cliente = require("./cliente.model")(sequelize);
const Producto = require("./producto.model")(sequelize);
const Ingrediente = require("./ingrediente.model")(sequelize);
const InventoryMovement = require("./inventoryMovement.model")(sequelize);
const Order = require("./order.model")(sequelize);
const ProductionLot = require("./productionLot.model")(sequelize);
const OrderItem = require("./orderItem.model")(sequelize);
const RecipeIngredient = require("./recipeIngredient.model")(sequelize);
const LotOrder = require("./lotOrder.model")(sequelize);

// ==========================================
// RELACIONES
// ==========================================

// --- 1. USUARIOS ---
Usuario.hasMany(authToken, { foreignKey: "idUsuario", as: "authTokens" });
authToken.belongsTo(Usuario, { foreignKey: "idUsuario", as: "usuario" });

Usuario.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(Usuario, { foreignKey: "user_id" });

Usuario.hasMany(ProductionLot, {
  foreignKey: "responsible_user_id",
  as: "managedLots",
});
ProductionLot.belongsTo(Usuario, {
  foreignKey: "responsible_user_id",
  as: "responsible",
});

Usuario.hasMany(InventoryMovement, { foreignKey: "user_id" });
InventoryMovement.belongsTo(Usuario, { foreignKey: "user_id" });

// --- 2. CLIENTES ---
Cliente.hasMany(Order, { foreignKey: "client_id" });
Order.belongsTo(Cliente, { foreignKey: "client_id" });

// --- 3. PEDIDOS (Cabecera y Detalle) ---
Order.hasMany(OrderItem, { foreignKey: "order_id", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Producto.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Producto, { foreignKey: "product_id" });

// --- 4. RECETAS (Producto <-> Insumo) ---
Producto.belongsToMany(Ingrediente, {
  through: RecipeIngredient,
  foreignKey: "product_id",
  as: "ingredients",
});
Ingrediente.belongsToMany(Producto, {
  through: RecipeIngredient,
  foreignKey: "ingredient_id",
  as: "usedInProducts",
});

// --- 5. INVENTARIO ---
Ingrediente.hasMany(InventoryMovement, { foreignKey: "ingredient_id" });
InventoryMovement.belongsTo(Ingrediente, { foreignKey: "ingredient_id" });

// --- 6. PRODUCCIÓN ---
// Un lote produce un solo producto
Producto.hasMany(ProductionLot, { foreignKey: "product_id" });
ProductionLot.belongsTo(Producto, { foreignKey: "product_id" });

// Trazabilidad: Qué pedidos se alimentan de qué lote
ProductionLot.belongsToMany(Order, { through: LotOrder, foreignKey: "lot_id" });
Order.belongsToMany(ProductionLot, {
  through: LotOrder,
  foreignKey: "order_id",
});

module.exports = {
  Usuario,
  authToken,
  Cliente,
  Producto,
  Ingrediente,
  InventoryMovement,
  Order,
  ProductionLot,
  OrderItem,
  RecipeIngredient,
  LotOrder,
  sequelize,
  Sequelize: sequelize.Sequelize,
};
