const express = require('express');
const app = express();
const PORT = 80;
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/gil', (req, res) => {
    res.send('¡Hjalacoioo!');
});



app.get('/jalar', (req, res) => {
    res.send('jalennnnn holaa!');
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
