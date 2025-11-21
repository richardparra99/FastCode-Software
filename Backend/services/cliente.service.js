const { Cliente } = require("../models");
const { Op } = require("sequelize");

class ServicioCliente {
  /**
   * Obtener todos los clientes
   */
  async obtenerTodos(filtros = {}) {
    try {
      const where = {};

      // Búsqueda por nombre o teléfono
      if (filtros.busqueda) {
        where[Op.or] = [
          { fullName: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { phone: { [Op.iLike]: `%${filtros.busqueda}%` } },
        ];
      }

      const clientes = await Cliente.findAll({
        where,
        order: [["fullName", "ASC"]],
      });

      return clientes;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener cliente por ID
   */
  async obtenerPorId(id) {
    try {
      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }

      return cliente;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear cliente
   */
  async crear(datosCliente) {
    try {
      const { fullName, phone, address, isWhatsapp } = datosCliente;

      // Validar que el nombre no esté vacío
      if (!fullName || fullName.trim() === "") {
        throw new Error("El nombre del cliente es requerido");
      }

      const nuevoCliente = await Cliente.create({
        fullName,
        phone: phone || null,
        address: address || null,
        isWhatsapp: isWhatsapp || false,
      });

      return nuevoCliente;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar cliente
   */
  async actualizar(id, datosActualizacion) {
    try {
      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }

      const { fullName, phone, address, isWhatsapp } = datosActualizacion;

      const actualizaciones = {};

      if (fullName !== undefined) {
        if (fullName.trim() === "") {
          throw new Error("El nombre del cliente no puede estar vacío");
        }
        actualizaciones.fullName = fullName;
      }
      if (phone !== undefined) actualizaciones.phone = phone;
      if (address !== undefined) actualizaciones.address = address;
      if (isWhatsapp !== undefined) actualizaciones.isWhatsapp = isWhatsapp;

      await cliente.update(actualizaciones);

      return cliente;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar cliente
   */
  async eliminar(id) {
    try {
      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }

      await cliente.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar clientes por teléfono
   */
  async buscarPorTelefono(phone) {
    try {
      const clientes = await Cliente.findAll({
        where: {
          phone: { [Op.iLike]: `%${phone}%` },
        },
        limit: 10,
      });

      return clientes;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ServicioCliente();
