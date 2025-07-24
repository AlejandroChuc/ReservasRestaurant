// Test rápido de conexión a la base de datos
import mysql from 'mysql2/promise';

const testConnection = async () => {
  try {
    console.log('🔍 Probando conexión a MySQL...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '0000',
      database: 'reservas_restaurante'
    });

    console.log('✅ Conexión exitosa');

    // Probar consulta simple
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM Restaurante');
    console.log('📊 Total restaurantes:', rows[0].total);

    // Probar la consulta específica que está fallando
    const [restaurants] = await connection.execute(`
      SELECT 
        id_restaurante,
        nombre,
        CASE 
          WHEN LENGTH(descripcion) > 50 
          THEN CONCAT(LEFT(descripcion, 47), '...')
          ELSE descripcion
        END as descripcion,
        capacidad_max,
        logo,
        tipoCocina,
        imagenUrl
      FROM Restaurante
      LIMIT 5
    `);
    
    console.log('✅ Consulta de restaurantes exitosa');
    console.log('📋 Primeros restaurantes:', restaurants);

    await connection.end();
    console.log('✅ Conexión cerrada correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 La base de datos "reservas_restaurante" no existe');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Credenciales incorrectas (usuario/contraseña)');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 MySQL no está ejecutándose');
    }
  }
};

testConnection();
