// Servidor de prueba simplificado
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Bizcocho-8',
  database: 'reservas_restaurante',
  waitForConnections: true,
  connectionLimit: 10,
};

let db;

// Inicializar conexión a la base de datos
try {
  db = mysql.createPool(dbConfig);
  console.log('✅ Pool de conexiones creado');
} catch (error) {
  console.error('❌ Error al crear pool de conexiones:', error);
  process.exit(1);
}

// Test de conexión inicial
async function testInitialConnection() {
  try {
    console.log('🔍 Probando conexión inicial...');
    const [rows] = await db.execute('SELECT 1 as test');
    console.log('✅ Conexión a BD exitosa');
  } catch (error) {
    console.error('❌ Error de conexión inicial:', error);
    process.exit(1);
  }
}

// Endpoint de prueba básico
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor funcionando', timestamp: new Date().toISOString() });
});

// Endpoint para obtener restaurantes con logging detallado
app.get('/api/restaurantes', async (req, res) => {
  console.log('📥 Solicitud GET /api/restaurantes recibida');
  
  try {
    console.log('🔍 Ejecutando consulta a la base de datos...');
    
    const [rows] = await db.execute(`
      SELECT 
        id_restaurante,
        nombre,
        descripcion,
        capacidad_max,
        logo
      FROM Restaurante
    `);
    
    console.log(`✅ Consulta exitosa. ${rows.length} restaurantes encontrados`);
    console.log('📋 Primer restaurante:', rows[0] || 'No hay restaurantes');
    
    res.json(rows);
  } catch (error) {
    console.error('❌ Error en /api/restaurantes:', error);
    console.error('📍 Stack trace:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener restaurantes',
      details: error.message,
      code: error.code
    });
  }
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error('❌ Error no manejado:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = 4000;

// Iniciar servidor
async function startServer() {
  await testInitialConnection();
  
  app.listen(PORT, () => {
    console.log('🚀 Servidor de prueba iniciado');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
    console.log(`🍽️  Restaurantes: http://localhost:${PORT}/api/restaurantes`);
    console.log('===============================================');
  });
}

startServer().catch(console.error);
