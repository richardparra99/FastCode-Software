const { sequelize } = require("../config/config");

// Importar todos los modelos
const Usuario = require("./usuario.model")(sequelize);
const AuthToken = require("./authToken.model")(sequelize);
const Cliente = require("./cliente.model")(sequelize);
const Producto = require("./producto.model")(sequelize);
const Ingrediente = require("./ingrediente.model")(sequelize);
const InventoryMovement = require("./inventoryMovement.model")(sequelize);
const Order = require("./order.model")(sequelize);
const ProductionLot = require("./productionLot.model")(sequelize);
const OrderItem = require("./orderItem.model")(sequelize);
const RecipeIngredient = require("./recipeIngredient.model")(sequelize);
const LotOrder = require("./lotOrder.model")(sequelize);

// Modelos Contables
const Cuenta = require("./account.model")(sequelize);
const AsientoContable = require("./journalEntry.model")(sequelize);
const DetalleAsientoContable = require("./journalEntryDetail.model")(sequelize);
const Factura = require("./invoice.model")(sequelize);
const DetalleFactura = require("./invoiceItem.model")(sequelize);

// ==========================================
// RELACIONES
// ==========================================

// --- 1. USUARIOS ---
Usuario.hasMany(AuthToken, { foreignKey: "idUsuario", as: "authTokens" });
AuthToken.belongsTo(Usuario, { foreignKey: "idUsuario", as: "usuario" });

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

// --- 7. CONTABILIDAD ---
// Jerarquía de cuentas (auto-referencia)
Cuenta.hasMany(Cuenta, {
  foreignKey: "padreId",
  as: "subcuentas",
});
Cuenta.belongsTo(Cuenta, {
  foreignKey: "padreId",
  as: "cuentaPadre",
});

// Asientos contables - Cabecera y Detalle
AsientoContable.hasMany(DetalleAsientoContable, {
  foreignKey: "asientoContableId",
  as: "detalles",
  onDelete: "CASCADE",
});
DetalleAsientoContable.belongsTo(AsientoContable, {
  foreignKey: "asientoContableId",
  as: "asientoContable",
});

// Detalle de asiento - Cuenta contable
Cuenta.hasMany(DetalleAsientoContable, {
  foreignKey: "cuentaId",
});
DetalleAsientoContable.belongsTo(Cuenta, {
  foreignKey: "cuentaId",
  as: "cuenta",
});

// Usuarios y asientos contables
Usuario.hasMany(AsientoContable, {
  foreignKey: "creadoPor",
  as: "asientosCreados",
});
AsientoContable.belongsTo(Usuario, {
  foreignKey: "creadoPor",
  as: "creador",
});

Usuario.hasMany(AsientoContable, {
  foreignKey: "aprobadoPor",
  as: "asientosAprobados",
});
AsientoContable.belongsTo(Usuario, {
  foreignKey: "aprobadoPor",
  as: "aprobador",
});

// Facturas - Pedidos
Order.hasOne(Factura, {
  foreignKey: "pedido_id",
  as: "factura",
});
Factura.belongsTo(Order, {
  foreignKey: "pedido_id",
  as: "pedido",
});

// Facturas - Clientes
Cliente.hasMany(Factura, {
  foreignKey: "cliente_id",
});
Factura.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
});

// Facturas - Usuario que emite
Usuario.hasMany(Factura, {
  foreignKey: "emitida_por",
  as: "facturasEmitidas",
});
Factura.belongsTo(Usuario, {
  foreignKey: "emitida_por",
  as: "emisor",
});

// Facturas - Detalles
Factura.hasMany(DetalleFactura, {
  foreignKey: "facturaId",
  as: "detalles",
  onDelete: "CASCADE",
});
DetalleFactura.belongsTo(Factura, {
  foreignKey: "facturaId",
  as: "factura",
});

// Detalles Factura - Productos
Producto.hasMany(DetalleFactura, {
  foreignKey: "productoId",
});
DetalleFactura.belongsTo(Producto, {
  foreignKey: "productoId",
  as: "producto",
});

module.exports = {
  Usuario,
  AuthToken,
  Cliente,
  Producto,
  Ingrediente,
  InventoryMovement,
  Order,
  ProductionLot,
  OrderItem,
  RecipeIngredient,
  LotOrder,
  Cuenta,
  AsientoContable,
  DetalleAsientoContable,
  Factura,
  DetalleFactura,
  sequelize,
  Sequelize: sequelize.Sequelize,
};
