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

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Página de Inicio</title>
      
    </head>
    <body>
      <h1>¡Hola Munerdrfddo!</h1>
      <p>Bienvenido a mi sitio web servido con Expresfddfdfdfs.</p>
      
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
