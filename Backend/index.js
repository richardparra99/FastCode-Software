require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');

const db = require("./models");

const app = express()
const port = 3000

//Para habilitar las carpetas públicas
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Configuración de carga de archivos
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}));
// Para habilitar la BD
db.sequelize.sync({
    // force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});


const cors = require('cors');

// Permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost:5173', //puerto del frontend
    credentials: true
}));

require("./routes")(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
