const express = require('express');
const app = express();
const PORT = 80;

app.get('/gil', (req, res) => {
    res.send('¡Hjalacoioo!');
});

app.get('/', (req, res) => {
    res.send('jalennnnn holaa!');
});

app.get('/jalar', (req, res) => {
    res.send('jalennnnn holaa!');
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
