import path from 'path';
import { fileURLToPath } from 'url';
const fs = require('fs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "data", "json_data.json");

export function readJSON(_, res) {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(jsonString);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: error});
        return;
    }
}

export function writeJSON(req, res) {
    try {
        const jsonString = JSON.stringify(req.body);
        fs.writeFileSync(filePath, jsonString);
    } catch(error) {
        res.status(500).json({error: error});
        return;
    }
}