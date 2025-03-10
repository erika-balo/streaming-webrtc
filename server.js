const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Permite conexiones desde cualquier origen (en producción, restringe esto)
  },
});


app.use(cors());

const host_id = null
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  
  if(host_id){
    socket.emit('stream-started', {id: host_id});
  }

  // Escuchar cuando el host inicia la transmisión
  socket.on('start-stream', (streamData) => {
    console.log('Transmisión iniciada', streamData);
    host_id = streamData.id
    io.emit('stream-started', streamData);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });

  
  socket.on('stop-streaming', () => {
    console.log('Transmision detenida:');
    host_id = null;
    socket.emit('stream-stopped');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});