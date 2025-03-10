const { PeerServer } = require('peer');

const peerServer = PeerServer({
  port: 9000, // Puerto en el que correrá el servidor de señalización
  path: '/myapp', // Ruta para las conexiones de PeerJS
});

console.log('Servidor de señalización PeerJS corriendo en el puerto 9000');