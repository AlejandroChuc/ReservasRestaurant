import { db } from './backend/db/db.js';

async function moveImagesToLogo() {
  try {
    console.log('🔄 Moviendo imágenes del campo imagenUrl al campo logo...\n');
    
    const connection = await db.getConnection();
    
    // Actualizar todos los registros para mover imagenUrl a logo
    const [result] = await connection.execute(
      `UPDATE Restaurante SET logo = imagenUrl WHERE imagenUrl IS NOT NULL`
    );
    
    console.log(`✅ Actualizados ${result.affectedRows} registros`);
    
    // Limpiar el campo imagenUrl
    await connection.execute(`UPDATE Restaurante SET imagenUrl = NULL`);
    console.log('🧹 Campo imagenUrl limpiado');
    
    // Mostrar datos actualizados
    console.log('\n📊 Datos actualizados:');
    const [data] = await connection.execute('SELECT id_restaurante, nombre, logo, imagenUrl FROM Restaurante');
    console.table(data);
    
    connection.release();
    console.log('\n🎉 ¡Imágenes movidas exitosamente al campo logo!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.end();
  }
}

moveImagesToLogo();
