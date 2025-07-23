import { db } from './backend/db/db.js';

async function updateTestGuestDates() {
  try {
    console.log('🔄 Actualizando fechas del huésped de prueba...');
    
    // Fechas válidas: desde hoy hasta mañana
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const fechaLlegada = today.toISOString().split('T')[0];
    const fechaSalida = tomorrow.toISOString().split('T')[0];
    
    console.log(`📅 Nueva estancia: ${fechaLlegada} - ${fechaSalida}`);
    
    const [result] = await db.execute(
      `UPDATE Huesped 
       SET fecha_llegada = ?, fecha_salida = ?
       WHERE nombre = 'Prueba' AND apellido_paterno = 'Copilot'`,
      [fechaLlegada, fechaSalida]
    );
    
    if (result.affectedRows > 0) {
      console.log('✅ Fechas actualizadas correctamente');
      
      // Verificar los datos actualizados
      const [rows] = await db.execute(
        `SELECT * FROM Huesped WHERE nombre = 'Prueba' AND apellido_paterno = 'Copilot'`
      );
      
      if (rows.length > 0) {
        const huesped = rows[0];
        console.log('\n📋 Datos del huésped de prueba:');
        console.log(`   Nombre: ${huesped.nombre} ${huesped.apellido_paterno} ${huesped.apellido_materno}`);
        console.log(`   Habitación: ${huesped.num_habitacion}`);
        console.log(`   Personas: ${huesped.numero_personas}`);
        console.log(`   Llegada: ${huesped.fecha_llegada}`);
        console.log(`   Salida: ${huesped.fecha_salida}`);
        console.log(`   Email: ${huesped.correo}`);
      }
    } else {
      console.log('❌ No se encontró el huésped de prueba');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.end();
  }
}

updateTestGuestDates();
