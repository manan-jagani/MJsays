const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Serve the "assets" folder for images
app.use('/assets', express.static('assets'));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    io.emit('receive_message', data); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
