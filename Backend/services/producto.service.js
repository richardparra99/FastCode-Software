const { Producto, RecipeIngredient, Ingrediente } = require("../models");
const { Op } = require("sequelize");

class ServicioProducto {
  /**
   * Obtener todos los productos
   */
  async obtenerTodos(filtros = {}) {
    try {
      const where = {};

      // Filtro por estado activo
      if (filtros.isActive !== undefined) {
        where.isActive = filtros.isActive;
      }

      // Búsqueda por nombre
      if (filtros.busqueda) {
        where.name = { [Op.iLike]: `%${filtros.busqueda}%` };
      }

      const productos = await Producto.findAll({
        where,
        include: [
          {
            model: Ingrediente,
            as: "ingredients",
            through: {
              attributes: ["quantity_required"],
            },
          },
        ],
        order: [["name", "ASC"]],
      });

      return productos;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener producto por ID con ingredientes
   */
  async obtenerPorId(id) {
    try {
      const producto = await Producto.findByPk(id, {
        include: [
          {
            model: Ingrediente,
            as: "ingredients",
            through: {
              attributes: ["quantity_required"],
            },
          },
        ],
      });

      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      return producto;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear producto
   */
  async crear(datosProducto) {
    try {
      const { name, description, price, isActive, receta } = datosProducto;

      // Validaciones
      if (!name || name.trim() === "") {
        throw new Error("El nombre del producto es requerido");
      }

      if (!price || price <= 0) {
        throw new Error("El precio debe ser mayor a 0");
      }

      // Crear producto
      const nuevoProducto = await Producto.create({
        name,
        description: description || null,
        price,
        isActive: isActive !== undefined ? isActive : true,
      });

      // Si tiene receta, asociar ingredientes
      if (receta && Array.isArray(receta) && receta.length > 0) {
        await this.actualizarReceta(nuevoProducto.id, receta);
      }

      // Retornar producto con ingredientes
      return await this.obtenerPorId(nuevoProducto.id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar producto
   */
  async actualizar(id, datosActualizacion) {
    try {
      const producto = await Producto.findByPk(id);

      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      const { name, description, price, isActive, receta } = datosActualizacion;

      const actualizaciones = {};

      if (name !== undefined) {
        if (name.trim() === "") {
          throw new Error("El nombre del producto no puede estar vacío");
        }
        actualizaciones.name = name;
      }
      if (description !== undefined) actualizaciones.description = description;
      if (price !== undefined) {
        if (price <= 0) {
          throw new Error("El precio debe ser mayor a 0");
        }
        actualizaciones.price = price;
      }
      if (isActive !== undefined) actualizaciones.isActive = isActive;

      await producto.update(actualizaciones);

      // Actualizar receta si se proporciona
      if (receta !== undefined) {
        await this.actualizarReceta(id, receta);
      }

      // Retornar producto actualizado con ingredientes
      return await this.obtenerPorId(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar producto (soft delete)
   */
  async eliminar(id) {
    try {
      const producto = await Producto.findByPk(id);

      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      // Desactivar en lugar de eliminar
      await producto.update({ isActive: false });

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar receta del producto
   */
  async actualizarReceta(productoId, receta) {
    try {
      // Eliminar receta anterior
      await RecipeIngredient.destroy({
        where: { product_id: productoId },
      });

      // Agregar nuevos ingredientes
      if (receta && Array.isArray(receta) && receta.length > 0) {
        const ingredientesReceta = receta.map((item) => ({
          product_id: productoId,
          ingredient_id: item.ingredient_id,
          quantity_required: item.quantity_required,
        }));

        await RecipeIngredient.bulkCreate(ingredientesReceta);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Activar producto
   */
  async activar(id) {
    try {
      const producto = await Producto.findByPk(id);

      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      await producto.update({ isActive: true });

      return producto;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ServicioProducto();
