const express = require('express');
const http = require('http');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');

const app = express();
const server = http.createServer(app);

app.use(cors());

// Servidor PeerJS
const peerServer = ExpressPeerServer(server, {
  path: '/myapp',
  secure: true,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use('/peer', peerServer);

// Ruta de prueba
app.get('/test', (req, res) => {
  res.send('Servidor PeerJS funcionando correctamente');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor PeerJS escuchando en el puerto ${PORT}`);
});
