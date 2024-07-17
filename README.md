### System Requirements

- [x] The server is written in Node.JS
- [x] The server can be started with `npm start`
- [ ] The server can be started in developer mode with `npm run dev`
- [ ] The interfaces are reachable by devices on other networks (not just localhost)
- [ ] The server will not start unless environment variables are set for interface access keys
- [ ] The environment variable access codes match the accepted access codes entered into the interfaces

### Front Desk Interface (Receptionist)

- [x] The receptionist can see a list of upcoming races
- [x] The receptionist can delete an upcoming race
- [x] The receptionist can add new race sessions
- [x] The receptionist can add/edit/remove drivers from a race
- [x] It is not possible to have two drivers with the same name
- [ ] Race sessions disappear from the Front Desk interface once it is safe to start
- [ ] The race drivers cannot be edited after the race is safe to start

### Next Race Display (Race Driver)

- [ ] The upcoming race session is displayed on the Next Race display
- [ ] The Next Race display switches to the subsequent race, once the current race is safe to start
- [ ] The Next Race display shows the drivers names, and the cars they're assigned to
- [ ] If there are no upcoming races, no sessions are displayed
- [ ] When the race session is ended, the Next Race display shows an additional message to proceed to the paddock

### Race Control Interface (Safety Official)

- [ ] If there is no upcoming race after the last session is ended, the Safety Official sees no upcoming races message
- [x] The safety official has one active button, which starts the race when pressed
- [ ] When the race is started, the following happens:
  - The race mode is changed to "Safe"
  - The leader board changes to the current race
  - The Next Race screen switches to the subsequent race session
  - The Safety Official sees race mode controls
- [x] When the Safety Official selects "Safe", the Flag screen is green
- [x] When the Safety Official selects "Hazard", the Flag screen is yellow
- [x] When the Safety Official selects "Danger", the Flag screen is red
- [x] When the Safety Official selects "Finish", the Flag screen is chequered
- [x] When the race mode changes to "Finish", the race controls disappear, and a button appears to end the race session
- [ ] When the Safety Official ends the race session, the next session appears on their interface
- [x] When the race session is ended, the race mode changes to "Danger"
- [x] The Race Control interface is designed for a mobile interface

### Lap-Line Tracker Interface (Lap-line Observer)

- [ ] When the race session starts, the Lap-Line Observer sees a button for each car
- [ ] The lap button for each car has a large tappable area
- [ ] The Lap-line Tracker is designed for a tablet, featuring large tappable buttons for each car
- [ ] It should work in Landscape or Portrait

### Leaderboard (Guest)

- [ ] The leaderboard shows the remaining time on the timer
- [ ] The leaderboard shows the flag color for the current race mode
- [ ] When the lap button is pressed for a car, the leader board is updated
- [ ] The leaderboard is ordered by fastest lap times
- [ ] The leaderboard shows the drivers name and car number
- [ ] The leaderboard shows the fastest lap time for each car
- [ ] The leaderboard shows the current lap for each car
- [ ] The first lap starts when the car crosses the leader board for the first time

### Race Countdown and Flags (Race Driver)

- [x] The countdown timer runs for 1 minute instead of 10 minutes in dev mode
- [ ] The Race Flag interface displays the current race status (green, yellow, red, or chequered)

### General System Requirements

- [ ] Communication between interfaces is in real-time. API calls must not be used to send data
- [ ] Communication between interfaces utilizes messages sent via Socket.IO
- [ ] The Front Desk, Race Control and Lap-line Tracker require access codes to function correctly
- [ ] The server waits 500ms to respond if an incorrect access key is entered in the interface
- [ ] The interface re-prompts the user to enter a correct access key when an incorrect access key is inserted
- [ ] The buttons disappear or are visibly disabled between races
- [ ] Communication between the interfaces certainly does not use a polling convention

### Extra Features

- [ ] The system state is persisted (When the server is restarted, the system resumes with the exact same state)
- [ ] The receptionist can assign drivers to specific cars
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