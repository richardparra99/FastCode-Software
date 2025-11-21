const servicioCliente = require("../services/cliente.service");

class ControladorCliente {
  /**
   * GET /api/clientes
   * Listar todos los clientes
   */
  async obtenerTodos(req, res) {
    try {
      const { busqueda } = req.query;

      const clientes = await servicioCliente.obtenerTodos({ busqueda });

      res.status(200).json({
        exito: true,
        cantidad: clientes.length,
        datos: clientes,
      });
    } catch (error) {
      console.error("Error al listar clientes:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/clientes/:id
   * Obtener cliente por ID
   */
  async obtenerPorId(req, res) {
    try {
      const cliente = await servicioCliente.obtenerPorId(req.params.id);

      res.status(200).json({
        exito: true,
        datos: cliente,
      });
    } catch (error) {
      console.error("Error al obtener cliente:", error);
      res.status(404).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * POST /api/clientes
   * Crear nuevo cliente
   */
  async crear(req, res) {
    try {
      const { fullName, phone, address, isWhatsapp } = req.body;

      if (!fullName) {
        return res.status(400).json({
          exito: false,
          mensaje: "El nombre del cliente es requerido",
        });
      }

      const nuevoCliente = await servicioCliente.crear({
        fullName,
        phone,
        address,
        isWhatsapp,
      });

      res.status(201).json({
        exito: true,
        mensaje: "Cliente creado exitosamente",
        datos: nuevoCliente,
      });
    } catch (error) {
      console.error("Error al crear cliente:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * PATCH /api/clientes/:id
   * Actualizar cliente
   */
  async actualizar(req, res) {
    try {
      const { fullName, phone, address, isWhatsapp } = req.body;

      const clienteActualizado = await servicioCliente.actualizar(
        req.params.id,
        {
          fullName,
          phone,
          address,
          isWhatsapp,
        }
      );

      res.status(200).json({
        exito: true,
        mensaje: "Cliente actualizado exitosamente",
        datos: clienteActualizado,
      });
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * DELETE /api/clientes/:id
   * Eliminar cliente
   */
  async eliminar(req, res) {
    try {
      await servicioCliente.eliminar(req.params.id);

      res.status(200).json({
        exito: true,
        mensaje: "Cliente eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      res.status(400).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/clientes/buscar/telefono
   * Buscar clientes por teléfono
   */
  async buscarPorTelefono(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({
          exito: false,
          mensaje: "El teléfono es requerido",
        });
      }

      const clientes = await servicioCliente.buscarPorTelefono(phone);

      res.status(200).json({
        exito: true,
        cantidad: clientes.length,
        datos: clientes,
      });
    } catch (error) {
      console.error("Error al buscar clientes:", error);
      res.status(500).json({
        exito: false,
        mensaje: error.message,
      });
    }
  }
}

module.exports = new ControladorCliente();
