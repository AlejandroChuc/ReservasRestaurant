import { db } from './backend/db/db.js';

async function testConnection() {
  try {
    console.log('🔄 Probando conexión a la base de datos...');
    
    // Probar la conexión
    const connection = await db.getConnection();
    console.log('✅ Conexión exitosa a la base de datos MySQL');
    
    // Verificar que la base de datos existe
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('📊 Bases de datos disponibles:', databases.map(row => row.Database));
    
    // Verificar las tablas en nuestra base de datos
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('🗃️ Tablas en reservas_restaurante:', tables);
    
    // Si hay tablas, mostrar algunos datos de ejemplo
    if (tables.length > 0) {
      console.log('\n📈 Datos de ejemplo:');
      
      // Verificar huéspedes
      try {
        const [huespedes] = await connection.execute('SELECT COUNT(*) as total FROM Huesped');
        console.log(`👥 Total de huéspedes: ${huespedes[0].total}`);
      } catch (error) {
        console.log('⚠️ Tabla Huesped no existe o está vacía');
      }
      
      // Verificar restaurantes
      try {
        const [restaurantes] = await connection.execute('SELECT COUNT(*) as total FROM Restaurante');
        console.log(`🍽️ Total de restaurantes: ${restaurantes[0].total}`);
      } catch (error) {
        console.log('⚠️ Tabla Restaurante no existe o está vacía');
      }
      
      // Verificar reservas
      try {
        const [reservas] = await connection.execute('SELECT COUNT(*) as total FROM Reserva');
        console.log(`📅 Total de reservas: ${reservas[0].total}`);
      } catch (error) {
        console.log('⚠️ Tabla Reserva no existe o está vacía');
      }
    }
    
    connection.release();
    console.log('\n✅ Prueba de conexión completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    console.error('💡 Verifica que:');
    console.error('   1. MySQL esté ejecutándose');
    console.error('   2. Las credenciales sean correctas');
    console.error('   3. La base de datos "reservas_restaurante" exista');
  } finally {
    await db.end();
  }
}

testConnection();
