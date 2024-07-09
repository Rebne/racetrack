import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (_, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/race-flags', (_, res) => {
  res.sendFile(join(__dirname, 'flag.html'));
});

io.on('connection', (socket) => {

  console.log('a user connected');

  //router
  socket.onAny((eventName, data) => {
    console.log(eventName);
    console.log(data);
    io.emit(eventName, data);
  });

  // for debugging (console logging all emits)
  socket.onAny((eventName, ...args) => {
    console.log(eventName);
    console.log(args);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});