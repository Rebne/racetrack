import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import * as database from './database.js';
import { readRacesLocally, readDriversLocally , deleteRaceLocally} from './database.js';

dotenv.config();

const REQUIRED_KEYS = ['FRONT_DESK_KEY','RACE_CONTROL_KEY', 'LAP_LINE_TRACKER_KEY']

const missingKeys = REQUIRED_KEYS.filter(key => !process.env[key]);

if (missingKeys.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingKeys.join(', ')}`);
  process.exit(1);
}

const frontDeskKey = process.env['FRONT_DESK_KEY'];
const raceControlKey = process.env['RACE_CONTROL_KEY'];
const lapLineTrackerKey = process.env['LAP_LINE_TRACKER_KEY'];

const server = createServer(app);
const io = new Server(server);

const port = 3000;

let isDevMode = false;

if (process.argv.length > 2 && process.argv[2] == 'dev') {
  isDevMode = true;
}

//||\\//\\//\\||//||\\
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname));

// Middleware for checking acces codes
const requireAccesKey = (req, res , next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

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
  res.sendFile(join(__dirname, 'static', 'glossary.html'));
});

app.get('/race-control', (_, res) => {
  res.sendFile(join(__dirname, 'static', 'race-control.html'));
});

app.get('/race-flags', (_, res) => {
  res.sendFile(join(__dirname, 'static', 'flag.html'));
});

app.get('/front-desk', (_, res) => {
  res.sendFile(join(__dirname, 'static', 'front-desk.html'));
});

app.get('/race-countdown', (_, res) => {
  res.sendFile(join(__dirname, 'static', 'race-countdown.html'));
});

app.get('/lap-line-tracker', (_, res) => {
  res.sendFile(join(__dirname, 'static', 'lap-line-tracker.html'));
})

app.get('/leader-board', (_, res) => {
  res.sendFile(join(__dirname, 'static', 'leader-board.html'));
})

app.get('/next-race', (_, res) => {
  res.sendFile(join(__dirname, 'static', 'next-race.html'));
})

async function getNextRace() {
  try {
    const races = await readRacesLocally();
    if (!races || races.length == 0) {
      return -1
    };
    let nextRace = races[0].id;
    for (const row of races) {
      if (nextRace < row.id) {
        nextRace = nextRace;
      } else {
        nextRace = row.id;
      }
    }
    return nextRace
  } catch (error) {
    console.error('Error reading races', error);
    return -1;
  }
}

async function getRaceData(raceID) {
  try {
    let drivers = [];
    const data = await readDriversLocally(raceID);
    data.forEach((driver) => {
      drivers.push({ name: driver.name, car: driver.car });
    });
    return { id: raceID, drivers: drivers };
  } catch (error) {
    console.error('Error reading drivers', error);
  }
}

io.on('connection', (socket) => {

  console.log('a user connected');

  //router
  socket.onAny((eventName, data) => {
    console.log(eventName);
    console.log(data);
    io.emit(eventName, data);
  });

  socket.emit('devMode', { isDevMode: isDevMode });

  socket.on('lap-recorded', (data) => {
    console.log(`Lap recorded for car: ${data.carName}`);
  });

  socket.on('start:race', async () => {
    try {
      const raceID = await getNextRace();
      const race = await getRaceData(raceID);
      io.emit('race:data', race);
      //FOR DEV
      //deleteRaceLocally(raceID);
      //io.emit('remove:race')
    } catch (error) {
      console.error('Error emitting race:data', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log('server running at http://localhost:3000');
});
