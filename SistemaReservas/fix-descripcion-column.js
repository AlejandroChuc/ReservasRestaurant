import { db } from './backend/db/db.js';

async function fixDescripcionColumn() {
  try {
    console.log('🔧 Corrigiendo el nombre de la columna descripción...\n');
    
    const connection = await db.getConnection();
    
    // Verificar la estructura actual
    console.log('📋 Estructura actual de la tabla:');
    const [currentStructure] = await connection.execute('DESCRIBE Restaurante');
    console.table(currentStructure);
    
    // Renombrar la columna de "descripción" a "descripcion" (sin tilde)
    console.log('\n🔄 Cambiando nombre de columna de "descripción" a "descripcion"...');
    await connection.execute('ALTER TABLE Restaurante CHANGE descripción descripcion TEXT');
    
    console.log('✅ Columna renombrada exitosamente');
    
    // Verificar la nueva estructura
    console.log('\n📋 Nueva estructura de la tabla:');
    const [newStructure] = await connection.execute('DESCRIBE Restaurante');
    console.table(newStructure);
    
    // Mostrar algunos datos para verificar que todo esté bien
    console.log('\n📊 Datos de restaurantes (verificación):');
    const [data] = await connection.execute('SELECT id_restaurante, nombre, descripcion FROM Restaurante LIMIT 2');
    console.table(data);
    
    connection.release();
    console.log('\n🎉 ¡Columna corregida exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al corregir la columna:', error.message);
  } finally {
    await db.end();
  }
}

fixDescripcionColumn();
