const getObjectOr404 = (model) => async (req, res, next) => {
    const { id } = req.params;
    try {
        const obj = await model.findByPk(id);
        if (!obj) {
            return res.status(404).json({ error: 'Objeto no encontrado' });
        }
        req.obj = obj;
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener el objeto' });
    }
}
module.exports = getObjectOr404;
