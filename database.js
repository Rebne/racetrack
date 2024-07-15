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

//
export function createRow(req, res) {
    const body = req.body;
    const table = body.table;
    const data = body.data;

    const keys = Object.keys(data);
    const values = Object.values(data);

    const questionMarks = [];
    for (let i =0; i < keys.length;i++) {
        questionMarks.push('?');
    }

    const sql = `INSERT INTO ${table} (${keys.join()}) VALUES (${questionMarks.join()})`;
    console.log(sql);
    console.log(values);
    // cannot use lambda () => {} here, have to use function(){}
    db.run(sql, values, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201);
    });
}

export function deleteRow(req, res) {
    const sql = 'DELETE FROM races WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
    });
}