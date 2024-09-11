# Race Management System Todo List

## Environment Variables and Access Control
- [x] Fix environment variable detection in dev and start modes
- [x] Implement error handling for missing access keys
- [x] Prevent server from starting if access keys are not defined

## Race Management
- [x] Handle duplicate car numbers consistently across frontend and backend
- [x] Implement transaction reversal or proper error handling in the database layer

## Real-time Communication
- [x] Ensure race-control and next-race views receive updates without refresh
- [x] Fix race-flag to receive and display correct flag state
- [ ] Implement in-progress tracking for best laps on the leaderboard view
- [ ] Update Lap-Line-Tracker to receive race state in real-time
- [ ] Create best lap for racers even if race ends without lap-line-tracker interaction

## Race Control and Flags
- [ ] Prevent flag changes for completed races in Race-Control view
- [ ] Review and potentially remove "None" flag option in Race-Control view
- [ ] Update leaderboard flag display when race-control sets race to "Finish" state
- [ ] Implement proper race start conditions (e.g., minimum number of racers)
- [ ] Fix leaderboard flag display inconsistencies between races

## Interface Updates
- [ ] Update Front-desk view in real-time when race is started in race-control
- [ ] Fix race reset issue when timer runs out but race is not marked as finished
- [ ] Prevent non-existing races from being started

## Compliance Issues
- [ ] Implement proper race mode changes and UI updates:
  - [ ] Race controls should disappear and "end race" button should appear when race mode changes to "Finish"
  - [ ] Broadcast all race state changes through sockets in real-time
  - [ ] Ensure race sessions disappear from Front Desk interface once safe to start
  - [ ] Change race mode to "Danger" when race session is ended
  - [ ] Update Lap-Line Observer interface in real-time when race session starts
  - [ ] Disable or hide buttons between races in Lap-Line Tracker

## Network Accessibility
- [x] Make interfaces accessible from external networks:
  - [-] ~~Implement proper network configuration (port forwarding, firewall adjustments)~~
  - [x] Consider using ngrok for simplified external access (resolve CORS issues) - made ngrok a dependency for the project.

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

### System Requirements

- [x] The server is written in Node.JS
- [x] The server can be started with `npm start`
- [x] The server can be started in developer mode with `npm run dev`
- [x] The interfaces are reachable by devices on other networks (not just localhost)
- [x] The server will not start unless environment variables are set for interface access keys
- [x] The environment variable access codes match the accepted access codes entered into the interfaces

### Front Desk Interface (Receptionist)

- [x] The receptionist can see a list of upcoming races
- [x] The receptionist can delete an upcoming race
- [x] The receptionist can add new race sessions
- [x] The receptionist can add/edit/remove drivers from a race
- [x] It is not possible to have two drivers with the same name
- [x] Race sessions disappear from the Front Desk interface once it is safe to start
- [x] The race drivers cannot be edited after the race is safe to start

### Next Race Display (Race Driver)

- [x] The upcoming race session is displayed on the Next Race display
- [x] The Next Race display switches to the subsequent race, once the current race is safe to start
- [x] The Next Race display shows the drivers names, and the cars they're assigned to
- [x] If there are no upcoming races, no sessions are displayed
- [x] When the race session is ended, the Next Race display shows an additional message to proceed to the paddock

### Race Control Interface (Safety Official)

- [x] If there is no upcoming race after the last session is ended, the Safety Official sees no upcoming races message
- [x] The safety official has one active button, which starts the race when pressed
- [x] When the race is started, the following happens:
  - The race mode is changed to "Safe"
  - The leader board changes to the current race
  - The Next Race screen switches to the subsequent race session
  - The Safety Official sees race mode controls
- [x] When the Safety Official selects "Safe", the Flag screen is green
- [x] When the Safety Official selects "Hazard", the Flag screen is yellow
- [x] When the Safety Official selects "Danger", the Flag screen is red
- [x] When the Safety Official selects "Finish", the Flag screen is chequered
- [x] When the race mode changes to "Finish", the race controls disappear, and a button appears to end the race session
- [x] When the Safety Official ends the race session, the next session appears on their interface
- [x] When the race session is ended, the race mode changes to "Danger"
- [x] The Race Control interface is designed for a mobile interface

### Lap-Line Tracker Interface (Lap-line Observer)

- [x] When the race session starts, the Lap-Line Observer sees a button for each car
- [x] The lap button for each car has a large tappable area
- [x] The Lap-line Tracker is designed for a tablet, featuring large tappable buttons for each car
- [x] It should work in Landscape or Portrait
- [x] The buttons disappear or are visibly disabled between races

### Leaderboard (Guest)

- [x] The leaderboard shows the remaining time on the timer
- [x] The leaderboard shows the flag color for the current race mode
- [x] When the lap button is pressed for a car, the leader board is updated
- [x] The leaderboard is ordered by fastest lap times
- [x] The leaderboard shows the drivers name and car number
- [x] The leaderboard shows the fastest lap time for each car
- [x] The leaderboard shows the current lap for each car
- [x] The first lap starts when the car crosses the leader board for the first time

### Race Countdown and Flags (Race Driver)

- [x] The countdown timer runs for 1 minute instead of 10 minutes in dev mode
- [x] The Race Flag interface displays the current race status (green, yellow, red, or chequered)

### General System Requirements

- [x] Communication between interfaces is in real-time. API calls must not be used to send data
- [x] Communication between interfaces utilizes messages sent via Socket.IO
- [x] The Front Desk, Race Control and Lap-line Tracker require access codes to function correctly
- [x] The server waits 500ms to respond if an incorrect access key is entered in the interface
- [x] The interface re-prompts the user to enter a correct access key when an incorrect access key is inserted
- [x] Communication between the interfaces certainly does not use a polling convention

### Extra Features

- [x] The system state is persisted (When the server is restarted, the system resumes with the exact same state)
- [x] The receptionist can assign drivers to specific cars
### Interface Routes

| Interface        | Persona           | Route               |
| ---------------- | ----------------- | ------------------- |
| Front Desk       | Receptionist      | `/front-desk`       |
| Race Control     | Safety Official   | `/race-control`     |
| Lap-line Tracker | Lap-line Observer | `/lap-line-tracker` |
| Leader Board     | Guest             | `/leader-board`     |
| Next Race        | Race Driver       | `/next-race`        |
| Race Countdown   | Race Driver       | `/race-countdown`   |
| Race Flag        | Race Driver       | `/race-flags`       |
