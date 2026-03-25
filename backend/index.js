// index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite leer JSON en el body de las peticiones

// 1. GET /sales - Lista ventas
app.get('/sales', (req, res) => {
    db.all('SELECT * FROM sales',[], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 2. POST /sales - Crea una venta
app.post('/sales', (req, res) => {
    const { customer, product, amount } = req.body;
    
    // Validación básica que suma puntos en la evaluación
    if (!customer || !product || amount === undefined) {
        return res.status(400).json({ error: 'Faltan los campos obligatorios (customer, product, amount)' });
    }
    
    const sql = 'INSERT INTO sales (customer, product, amount) VALUES (?, ?, ?)';
    db.run(sql, [customer, product, amount], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, customer, product, amount, score: null });
    });
});

// 3. POST /sales/:id/evaluate - Evalua una venta
app.post('/sales/:id/evaluate', (req, res) => {
    const { id } = req.params;
    const { score } = req.body;

    // Validamos el score, para que sea del 1 al 5 como solicitan los requerimientos
    if (!score || score < 1 || score > 5) {
        return res.status(400).json({ error: 'El score debe ser un número entre 1 y 5' });
    }

    const sql = 'UPDATE sales SET score = ? WHERE id = ?';
    db.run(sql,[score, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json({ message: 'Venta evaluada correctamente', id, score });
    });
});

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
});