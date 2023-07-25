const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Configurar el directorio de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Exportar el servidor Express
module.exports = app;
