import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import * as database from './database.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = 3000;

let isDevMode = false;

if (process.argv.length > 2 && process.argv[2] == 'dev') {
  isDevMode = true;
}

app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname));

app.delete('/drivers', database.deleteDriver)
app.delete('/races', database.deleteRace);
app.post('/drivers', database.createDriver);
app.post('/races', database.createRace);
app.get('/races', database.readRaces);
app.get('/drivers/:id', database.readDrivers);
app.put('/drivers', database.updateDriver);

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
  res.sendFile(join(__dirname,'static','race-countdown.html'));
});

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

  socket.emit('devMode', {isDevMode: isDevMode});

  // Handle 'create:race' event
  socket.on('create:race', (data) => {
    console.log('New race created:', data);
    // Broadcast the new race to all connected clients
    io.emit('new:race', data);
  });

  // Handle lap recording
  socket.on('lap-recorded', (data) => {
    console.log(`Lap recorded for car: ${data.carName}`);
    // Further processing, like updating lap counts, could go here
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log('server running at http://localhost:3000');
});
