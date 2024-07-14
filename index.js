import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import {createRace, deleteRace} from './database.js'

const app = express();
const server = createServer(app);
const io = new Server(server);

let isDevMode = false;

if (process.argv.length > 2 && process.argv[2] == 'dev') {
  isDevMode = true;
} 

app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname));


app.post('/races', createRace);
app.delete('/races/:id', deleteRace);

app.get('/test', (_, res) => {
  res.sendFile(join(__dirname, 'static', 'test.html'));
});

app.get('/', (_, res) => {
  res.sendFile(join(__dirname,'static', 'glossary.html'));
});

app.get('/race-control', (_, res) => {
  res.sendFile(join(__dirname,'static', 'race-control.html'));
});

app.get('/race-flags', (_, res) => {
  res.sendFile(join(__dirname,'static', 'flag.html'));
});

app.get('/front-desk', (_, res) => {
  res.sendFile(join(__dirname,'static', 'front-desk.html'));
});

app.get('/race-countdown', (_, res) => {
  res.sendFile(join(__dirname,'static', 'race-countdown.html'));
})

app.get('/lap-line-tracker', (_, res) => {
  res.sendFile(join(__dirname,'static', 'lap-line-tracker.html'));
})

app.get('/leader-board', (_, res) => {
  res.sendFile(join(__dirname,'static', 'leader-board.html'));
})

app.get('/next-race', (_, res) => {
  res.sendFile(join(__dirname,'static', 'next-race.html'));
})

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