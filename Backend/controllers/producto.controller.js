const servicioProducto = require("../services/producto.service");

class ControladorProducto {
  /**
   * GET /api/productos
   * Listar todos los productos
   */
  async obtenerTodos(req, res) {
    try {
      const { busqueda, isActive } = req.query;

      const filtros = {};
      if (busqueda) filtros.busqueda = busqueda;
      if (isActive !== undefined) filtros.isActive = isActive === "true";

      const productos = await servicioProducto.obtenerTodos(filtros);

      res.status(200).json({
        exito: true,
        cantidad: productos.length,
        datos: productos,
      });
    } catch (error) {
      console.error("Error al listar productos:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/productos/:id
   * Obtener producto por ID
   */
  async obtenerPorId(req, res) {
    try {
      const producto = await servicioProducto.obtenerPorId(req.params.id);

      res.status(200).json({
        exito: true,
        datos: producto,
      });
    } catch (error) {
      console.error("Error al obtener producto:", error);
      res.status(404).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/productos
   * Crear nuevo producto
   */
  async crear(req, res) {
    try {
      const { name, description, price, isActive, receta } = req.body;

      if (!name || !price) {
        return res.status(400).json({
          exito: false,
          mensaje: "Nombre y precio son requeridos",
        });
      }

      const nuevoProducto = await servicioProducto.crear({
        name,
        description,
        price,
        isActive,
        receta,
      });

      res.status(201).json({
        exito: true,
        mensaje: "Producto creado exitosamente",
        datos: nuevoProducto,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * PATCH /api/productos/:id
   * Actualizar producto
   */
  async actualizar(req, res) {
    try {
      const { name, description, price, isActive, receta } = req.body;

      const productoActualizado = await servicioProducto.actualizar(
        req.params.id,
        {
          name,
          description,
          price,
          isActive,
          receta,
        }
      );

      res.status(200).json({
        exito: true,
        mensaje: "Producto actualizado exitosamente",
        datos: productoActualizado,
      });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * DELETE /api/productos/:id
   * Eliminar producto (soft delete)
   */
  async eliminar(req, res) {
    try {
      await servicioProducto.eliminar(req.params.id);

      res.status(200).json({
        exito: true,
        mensaje: "Producto desactivado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/productos/:id/activar
   * Activar producto
   */
  async activar(req, res) {
    try {
      const producto = await servicioProducto.activar(req.params.id);

      res.status(200).json({
        exito: true,
        mensaje: "Producto activado exitosamente",
        datos: producto,
      });
    } catch (error) {
      console.error("Error al activar producto:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * PUT /api/productos/:id/receta
   * Actualizar receta del producto
   */
  async actualizarReceta(req, res) {
    try {
      const { receta } = req.body;

      if (!Array.isArray(receta)) {
        return res.status(400).json({
          exito: false,
          mensaje: "La receta debe ser un array de ingredientes",
        });
      }

      await servicioProducto.actualizarReceta(req.params.id, receta);

      const producto = await servicioProducto.obtenerPorId(req.params.id);

      res.status(200).json({
        exito: true,
        mensaje: "Receta actualizada exitosamente",
        datos: producto,
      });
    } catch (error) {
      console.error("Error al actualizar receta:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }
}

module.exports = new ControladorProducto();
