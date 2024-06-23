const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const port = 80;
const db = 'mongodb+srv://reypele18:mierda@dealgo.psquqeb.mongodb.net/DatosPrivados?retryWrites=true&w=majority&appName=dealgo';

let globalusuario;
let pagina = {};

app.use(cors({
    origin: 'https://frontendiniciar.onrender.com', // Reemplaza con el dominio de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(db, {}).then(() => {
    console.log("Conexión exitosa a la base de datos mierda");
}).catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
});

const datosSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const mensajeSchema = mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    message: { type: String },
    datos: { type: Buffer },
    tipo: { type: String },
    filetype: { type: String },
    read: { type: Boolean, required: true }
});

const Cuenta = mongoose.model("Cuenta", datosSchema, "Cuentas");
const Mensaje = mongoose.model("Mensaje", mensajeSchema, "Mensajes");

const storage = multer.memoryStorage(); // Almacenamiento en memoria para leer los datos del archivo como Buffer
const upload = multer({ storage: storage });


app.use(express.json());

app.use(bodyParser.json({ limit: '10000mb' })); // Aumenta el límite de carga útil a 10 megabytes

app.post('/registro', async (req, res) => {
    const { username, password } = req.body;
    try {
        const usuario = await Cuenta.create({ username, password });
        res.status(200).json({ message: 'Listo', ok: true, data: "Cuenta creada" });
    } catch (error) {
        console.log('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const usuario = await Cuenta.findOne({ username, password });
        if (usuario) {
            console.log("Logeado");
            res.status(201).json({ datito: "Logeado" });
        } else {
            res.status(401).json({ mensaje: 'Nombre de usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.log('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

app.get("/" , async (req, res) => {
    const url = 'https://frontendiniciar.onrender.com';
    try {
        const response = await axios.get(url);
        const htmlContent = response.data;
        res.send(htmlContent) 

        } catch (axiosError) {

            console.log('Error al obtener el HTML:', axiosError);
            res.send("Error web 12")
            
            }

})

app.post('/pagina-de-bienvenida', async (req, res) => {
    const { username } = req.body;
    globalusuario = username;

    try {
        const usuariosEncontrados = await Cuenta.find({ username });
        if (usuariosEncontrados.length > 0) {
            const url = 'https://frontendiniciar.onrender.com/beta.html';
            try {
                const response = await axios.get(url);
                const htmlContent = response.data;
                const htmlWithUsername = htmlContent.replace('<span id="usernamePlaceholder"></span>', username);

                pagina[username] = htmlWithUsername;
               

                res.status(200).json({ ok: true });
            } catch (axiosError) {
                console.log('Error al obtener el HTML:', axiosError);
                res.status(500).send('Error al obtener el HTML');
            }
        } else {
            console.log('Usuario no encontrado');
            res.status(404).send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Usuario no encontrado</title>
                </head>
                <body>
                    <h1>Usuario no encontrado</h1>
                </body>
                </html>
            `);
        }
    } catch (error) {
        console.log('Error al buscar usuario:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error al buscar usuario</title>
            </head>
            <body>
                <h1>Error al buscar usuario</h1>
            </body>
            </html>
        `);
    }
});

app.get('/home', (req, res) => {
    if (!globalusuario) {
        res.send('Se ha cerrado la sesión, vuelve a iniciar sesión: <a href="login.html">Login</a> <a href="create.html">Create</a>');
    } else {
        res.send(pagina[globalusuario]);
        globalusuario = "";
    }
});

app.post('/enviar-mensaje', upload.single('audio'), async (req, res) => {
    let { fromusername, recipient, message, tipo } = req.body;
    try {
        my_string = String(req.file.originalname);
        console.log("Mira mi listaa: " + my_string)
        my_list = my_string.split(',');
        fromusername = my_list[1];
        recipient = my_list[0];
        tipo = my_list[2];





    }  catch (error) {

    console.error("Error al procesar el archivoddCACA0000:", error);

     }



  


    try {
        if (fromusername == recipient) {
            return res.status(201).json({ mensaje: 'No te puedes enviar un mensaje a ti mismo' });
        } else {
            const destinatario = await Cuenta.findOne({ username: recipient });
            if (!destinatario) {
                return res.status(201).json({ mensaje: 'El destinatario no existe' });
            }
            
            if (tipo == "texto") {
                console.log("Es texto")
                const nuevoMensaje = await Mensaje.create({ sender: fromusername, recipient, message, tipo: "texto", read: false });
                res.status(200).json({ mensaje: 'Mensaje enviado correctamente' });
            } else if (tipo == "file") {
                console.log("Es file")
                fype = my_list[3] + "/" + my_list[4];
                const nuevoMensaje = await Mensaje.create({ sender: fromusername, recipient, datos: req.file.buffer, tipo: "file", filetype: fype, read: false });
                res.status(200).json({ mensaje: 'Mensaje enviado correctamente' });
            } else {
                console.log("Es audio")
                const nuevoMensaje = await Mensaje.create({ sender: fromusername, recipient, datos: req.file.buffer, tipo: "audio", read: false });
                res.status(200).json({ mensaje: 'Mensaje enviado correctamente' });
            }
        }
    } catch (error) {
        console.log('Error al enviar mensaje:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

})

app.put('/read', async (req, res) => {
    const { id } = req.body;

    try {
        const read = true;
        const mensajeActualizado = await Mensaje.findByIdAndUpdate(id, { read: read });
        res.status(200).json({ mensaje: 'Mensaje actualizado exitosamente' });
    } catch (error) {
        console.log('Error al actualizar el mensaje:', error);
        return res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

app.post('/mensajes-recibidos', async (req, res) => {
    const { username } = req.body;
    try {
        const mensajes = await Mensaje.find({ $or: [{ recipient: username }, { sender: username }] });
        res.status(200).json({ mensajes });
    } catch (error) {
        console.log('Error al obtener mensajes:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
