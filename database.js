import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db_name = path.join(__dirname, "data", "appdata.db");
const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('successful connection to database');
});

db.run('CREATE TABLE IF NOT EXISTS races (id INTEGER);');
db.run('CREATE TABLE IF NOT EXISTS drivers (id INTEGER PRIMARY KEY AUTOINCREMENT, race_id INTEGER, name TEXT, car INTEGER);');

export default db;

// implementing CRUD for tables woop woop

export function createRace(req, res) {
    const id = req.body.id;
    const sql = 'INSERT INTO races (id) VALUES (?);';
    db.run(sql, id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201);
    });
}

export function createDriver(req, res) {
    const { race_id, name, car } = req.body;
    const sql = 'INSERT INTO drivers (race_id, name, car) VALUES (?,?,?);';
    db.run(sql, [race_id, name, car], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201);
    });
}

export function updateDriver(req, res) {
    const { race_id, name, car } = req.body;
    const sql = 'UPDATE drivers SET name = ?, car = ? WHERE race_id = ? AND name = ? OR car = ?;';
    db.run(sql, [name, car, race_id, name, car], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200);
    });
}

export function readRacesLocally() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM races;';
        db.all(sql, [], function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
}

export function readRaces(_, res) {
    const sql = 'SELECT * FROM races;';
    db.all(sql, [], function (err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(rows);
    });
}

export function readDriversLocally(raceID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM drivers WHERE race_id = ?;';
        db.all(sql, raceID, function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export function readDrivers(req, res) {
    const race_id = parseInt(req.params.id);
    const sql = 'SELECT * FROM drivers WHERE race_id = ?;';
    db.all(sql, race_id, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(rows);
    });
}

export function deleteDriver(req, res) {
    const { name } = req.body;
    const sql = 'DELETE FROM drivers WHERE name = ?;';
    db.run(sql, name, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200);
    });
}

export function deleteRace(req, res) {
    const { id } = req.body;
    db.run("DELETE FROM races WHERE id = ?;", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
    });
    db.run("DELETE FROM drivers WHERE race_id = ?;", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
    });
    res.status(200);
}
