const db = require("../models/");

const validateUser = async (req, res, next) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!bearerToken.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = bearerToken.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const userToken = await db.authToken.findOne({ where: { token } });
    if (!userToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await db.UsuarioModel.findByPk(userToken.idUsuario);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    console.log("DATOS", req.user);
    next();
}

const validateParticipante = async (req, res, next) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!bearerToken.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = bearerToken.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const participante = await db.ParticipantesModel.findOne({ where: { linkParticipante: `http://localhost:3000/participantes/${token}` } });
    if (!participante) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    req.participante = participante;
    console.log("DATOS PARTICIPANTE", req.participante);
    next();
}



module.exports = { validateUser, validateParticipante };