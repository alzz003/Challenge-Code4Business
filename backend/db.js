// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Archivo local para la base de datos
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        // Crea la tabla con los campos que solicita la tarea
        db.run(`CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer TEXT NOT NULL,
            product TEXT NOT NULL,
            amount REAL NOT NULL,
            score INTEGER CHECK(score >= 1 AND score <= 5)
        )`);
    }
});

module.exports = db;