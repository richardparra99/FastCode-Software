const db = require('../models');

const checkDuplicate = (model, column) => {
  return async (req, res, next) => {
    const value = req.body[column];
    if (!value) {
      return res.status(400).json({ error: `El campo ${column} es obligatorio` });
    }

    try {
      const duplicate = await model.findOne({
        where: db.Sequelize.where(
          db.Sequelize.fn('LOWER', db.Sequelize.col(column)),
          db.Sequelize.fn('LOWER', value)
        )
      });

      if (duplicate) {
        return res.status(400).json({ error: `El valor del campo ${column} ya existe` });
      }

      next(); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al verificar duplicados' });
    }
  };
};

module.exports = checkDuplicate;