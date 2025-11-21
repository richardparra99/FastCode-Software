const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const RecipeIngredient = sequelize.define(
    "RecipeIngredient",
    {
      quantity_required: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return RecipeIngredient;
};
