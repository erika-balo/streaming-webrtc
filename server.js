const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');  // Importa ExpressPeerServer correctamente

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  path: '/socket.io',
  cors: {
    origin: '*', // Permite conexiones desde cualquier origen (en producción, restringe esto)
  },
});

app.use(cors());

// Aquí es donde creas el servidor de PeerJS
const peerServer = ExpressPeerServer(server, {
  path: '/myapp',  // El path de tu servidor de señalización
  secure: true,    // Asegúrate de usar HTTPS si es necesario
  cors: {
    origin: '*',  // Permitir solicitudes de cualquier origen
    methods: ['GET', 'POST'], // Métodos permitidos
  },
});

app.use('/peer', peerServer);

let host_id = null;
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id, host_id);

  if (host_id) {
    io.emit('in_streaming', { id: host_id });
  }

  socket.on('start-stream', (streamData) => {
    console.log('Transmisión iniciada', streamData);
    host_id = streamData.peerId;
    io.emit('stream-started', streamData);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });

  socket.on('stop-streaming', () => {
    console.log('Transmisión detenida:');
    host_id = null;
    io.emit('stream-stopped');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

app.get('/test', (req, res) => {
  res.send('Servidor de streaming en funcionamiento');
});
