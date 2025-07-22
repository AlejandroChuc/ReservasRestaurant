const express = require('express');
const path = require('path');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// --- API ROUTES ---
// Usa el router centralizado de la carpeta transpilada dist/api
app.use('/api', require('./dist/api/infrastructure/api/index.cjs'));

// --- SERVIR FRONTEND REACT ---
// Cambia 'build' por 'dist' si usas Vite
app.use(express.static(path.join(__dirname, 'build')));

// Para cualquier otra ruta, devuelve el index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
