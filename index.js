const server = require('./server');

// Iniciar el servidor
server.listen(80, () => {
  console.log('Servidor web en ejecución en http://localhost/');
});
