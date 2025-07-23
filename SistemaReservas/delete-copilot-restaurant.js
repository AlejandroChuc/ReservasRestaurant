import { db } from './backend/db/db.js';

async function deleteRestauranteCopilot() {
  try {
    console.log('🗑️ Eliminando el restaurante "Restaurante Copilot"...\n');
    
    const connection = await db.getConnection();
    
    // Primero verificar que existe
    const [existingRestaurant] = await connection.execute(
      'SELECT * FROM Restaurante WHERE nombre = ?', 
      ['Restaurante Copilot']
    );
    
    if (existingRestaurant.length === 0) {
      console.log('⚠️ No se encontró el restaurante "Restaurante Copilot"');
      connection.release();
      return;
    }
    
    console.log('📋 Restaurante encontrado:');
    console.table(existingRestaurant);
    
    const restaurantId = existingRestaurant[0].id_restaurante;
    
    // Primero eliminar las reservas asociadas a los horarios de este restaurante
    console.log('🔍 Buscando reservas asociadas...');
    const [reservas] = await connection.execute(
      `SELECT r.* FROM Reserva r 
       INNER JOIN Horario_Restaurante hr ON r.id_horario = hr.id_horario 
       WHERE hr.id_restaurante = ?`, 
      [restaurantId]
    );
    
    if (reservas.length > 0) {
      console.log(`� Eliminando ${reservas.length} reservas asociadas...`);
      await connection.execute(
        `DELETE r FROM Reserva r 
         INNER JOIN Horario_Restaurante hr ON r.id_horario = hr.id_horario 
         WHERE hr.id_restaurante = ?`, 
        [restaurantId]
      );
      console.log('✅ Reservas eliminadas');
    } else {
      console.log('ℹ️ No hay reservas asociadas');
    }
    
    // Luego eliminar los horarios asociados
    const [horarios] = await connection.execute(
      'SELECT * FROM Horario_Restaurante WHERE id_restaurante = ?', 
      [restaurantId]
    );
    
    if (horarios.length > 0) {
      console.log(`� Eliminando ${horarios.length} horarios asociados...`);
      await connection.execute(
        'DELETE FROM Horario_Restaurante WHERE id_restaurante = ?', 
        [restaurantId]
      );
      console.log('✅ Horarios eliminados');
    } else {
      console.log('ℹ️ No hay horarios asociados');
    }
    
    // Finalmente eliminar el restaurante
    const [result] = await connection.execute(
      'DELETE FROM Restaurante WHERE id_restaurante = ?', 
      [restaurantId]
    );
    
    if (result.affectedRows > 0) {
      console.log('✅ Restaurante "Restaurante Copilot" eliminado exitosamente');
      
      // Mostrar los restaurantes restantes
      console.log('\n📊 Restaurantes restantes:');
      const [remainingRestaurants] = await connection.execute('SELECT id_restaurante, nombre, tipoCocina FROM Restaurante');
      console.table(remainingRestaurants);
    } else {
      console.log('❌ No se pudo eliminar el restaurante');
    }
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Error al eliminar el restaurante:', error.message);
  } finally {
    await db.end();
  }
}

deleteRestauranteCopilot();
