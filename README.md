# Race Management System

## Problem Statement
Managing and coordinating race events involves multiple roles and interfaces, each responsible for different aspects of the event. From setting up race sessions and assigning drivers to specific cars, to ensuring real-time communication between race control, lap tracking, and leaderboard displays, the process can be complex and error-prone.

This Race Management System is designed to streamline and automate the process, ensuring that all participants have access to the necessary information, and that the race can be managed smoothly. The system provides distinct interfaces for receptionists, safety officials, lap-line observers, drivers, and guests, allowing each role to perform its functions efficiently.

## Technical Approach
The system is built using Node.js with a focus on real-time communication and state persistence. Socket.IO is utilized to enable real-time updates across all interfaces, ensuring that each role has the most up-to-date information without relying on API polling. The system is designed to be fault-tolerant, with state persistence ensuring that a server restart does not disrupt ongoing or scheduled races.

## Key Features
* Real-Time Communication: All interfaces communicate in real-time using Socket.IO, ensuring immediate updates across the system.
* State Persistence: The system's state is persisted, allowing for a seamless continuation after server restarts.
* Access Control: Access to the Front Desk, Race Control, and Lap-line Tracker interfaces is secured by environment variables, ensuring only authorized users can operate these interfaces.
* Responsive Design: The interfaces are designed to be responsive, catering to different devices such as tablets and mobile phones.

## Interesting Code Highlights
### 1. Environment Variable Validation
   Before starting the server, the system checks for the necessary environment variables to ensure that all access keys are correctly configured.
```javascript
const REQUIRED_KEYS = ['FRONT_DESK_KEY', 'RACE_CONTROL_KEY', 'LAP_LINE_TRACKER_KEY']

const missingKeys = REQUIRED_KEYS.filter(key => !process.env[key]);

if (missingKeys.length > 0) {
  console.log(missingKeys);
  console.error(`Error: Missing required environment variables: ${missingKeys.join(', ')}`);
  process.exit(1);
}
```
### 2. Access Control Middleware
   The requireAccesKey middleware checks whether a user has the correct session credentials before allowing access to specific routes.
```javascript
const requireAccesKey = (endpoint) => {
return (req, res, next) => {
if (req.session && req.session[endpoint]) {
next();
} else {
res.redirect('/login/' + endpoint);
}
};
};
```
This middleware is applied to routes that require authentication, such as /front-desk, /race-control, and /lap-line-tracker.
### 3. Real-Time Communication with Socket.IO
   The io.on('connection') block establishes a real-time connection with clients and handles various events related to the race system.
```javascript
io.on('connection', (socket) => {
  console.log('a user connected');

  // Router for all socket events
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
      deleteRaceLocally(raceID);
      io.emit('remove:race');
    } catch (error) {
      console.error('Error emitting race:data', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
```
This code handles key interactions, such as recording laps, starting races, and broadcasting real-time updates to all connected clients.
### 4. Dynamic Race Management
The functions getNextRace and getRaceData are used to fetch upcoming race data and manage the race sessions dynamically.
```javascript
async function getNextRace() {
  try {
    const races = await readRacesLocally();
    if (!races || races.length == 0) {
      return -1;
    }
    let nextRace = races[0].id;
    for (const row of races) {
      if (nextRace < row.id) {
        nextRace = nextRace;
      } else {
        nextRace = row.id;
      }
    }
    return nextRace;
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

```
These functions ensure that the system can dynamically determine and handle the next race session, reflecting the most current data in real-time.
### 5. Starting the Server and Displaying the IP Address
The server starts and displays the local IP address, which helps in accessing the interfaces from other devices on the network.
```javascript
function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

const IP = getLocalIP();
server.listen(port, () => {
  console.log(`server running on ${IP}:${port}`);
});

```
This code snippet ensures that the server is accessible not just on localhost, but also on other devices within the same network.

## Building and Running the Project
### Prerequisites
* Node.js (v14.x or higher)
* npm (v6.x or higher)
### Installation
#### 1. Clone the repository:

```bash
git clone https://gitea.kood.tech/karmokupits/racetrack.git
cd racetrack
```
#### 2. Install dependencies:

```bash
npm install
```

#### 3. Use the provided environment variables: The project includes a .env file with pre-set environment variables for testing purposes:
```plaintext
FRONT_DESK_KEY=1
RACE_CONTROL_KEY=2
LAP_LINE_TRACKER_KEY=3
```
You can use these default keys for initial testing. If you need to set your own keys, you can modify the .env file.

### Running the Project
Start the server in production mode:

```bash
npm start
```
The server will start and the interfaces will be accessible via the routes defined in the project.

Start the server in development mode:

```bash
npm run dev
```
This will start the server with additional debugging features, including a 1-minute countdown timer for race sessions.