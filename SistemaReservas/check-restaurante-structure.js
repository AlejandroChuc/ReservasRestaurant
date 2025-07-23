import { db } from './backend/db/db.js';

async function checkRestauranteStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla Restaurante...\n');
    
    const connection = await db.getConnection();
    
    // Mostrar estructura de la tabla
    const [structure] = await connection.execute('DESCRIBE Restaurante');
    console.log('📋 Estructura actual de la tabla Restaurante:');
    console.table(structure);
    
    // Mostrar datos actuales
    const [data] = await connection.execute('SELECT * FROM Restaurante');
    console.log('\n📊 Datos actuales en la tabla:');
    console.table(data);
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.end();
  }
}

checkRestauranteStructure();
