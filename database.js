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

db.run('CREATE TABLE IF NOT EXISTS races (id INTEGER)');
db.run('CREATE TABLE IF NOT EXISTS drivers (id INTEGER, race_id INTEGER, name TEXT, car INTEGER)');

export default db;

// implementing CRUD for tables

export function createRace(req, res) {
    const id = req.body.id;
    if (id === undefined) {
        res.status(400).json({ error: 'Race ID is required' });
    }
    const sql = 'INSERT INTO races (id) VALUES (?)';
    // cannot use lambda () => {} here, have to use function(){}
    db.run(sql, id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201);
    });
}

export function deleteRace(req, res) {
    const sql = 'DELETE FROM races WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
    });
}