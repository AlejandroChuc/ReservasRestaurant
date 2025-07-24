import { db } from './db/db.js';

async function verificarHuesped() {
  try {
    console.log('🔍 Buscando todos los huéspedes en la base de datos...\n');
    
    const [rows] = await db.execute('SELECT * FROM Huesped');
    
    if (rows.length === 0) {
      console.log('❌ No hay huéspedes en la base de datos');
      return;
    }
    
    console.log(`✅ Encontrados ${rows.length} huésped(es):\n`);
    
    rows.forEach((huesped, index) => {
      console.log(`--- Huésped ${index + 1} ---`);
      console.log(`ID: ${huesped.id_huesped}`);
      console.log(`Nombre: ${huesped.nombre}`);
      console.log(`Apellido Paterno: ${huesped.apellido_paterno}`);
      console.log(`Apellido Materno: ${huesped.apellido_materno}`);
      console.log(`Habitación: ${huesped.num_habitacion}`);
      console.log(`Personas: ${huesped.numero_personas}`);
      console.log(`Email: ${huesped.correo}`);
      console.log(`Llegada: ${huesped.fecha_llegada}`);
      console.log(`Salida: ${huesped.fecha_salida}`);
      console.log('');
    });
    
    // Buscar específicamente el huésped que estás intentando validar
    console.log('🔍 Buscando específicamente: Fernando Jesús May Bustos...\n');
    
    const [specificRows] = await db.execute(
      `SELECT * FROM Huesped 
       WHERE nombre = ? AND apellido_paterno = ? AND apellido_materno = ? 
       AND num_habitacion = ? AND correo = ?`,
      ['Fernando Jesús', 'May', 'Bustos', 456, 'fernando.may@test.com']
    );
    
    if (specificRows.length > 0) {
      console.log('✅ ¡Huésped encontrado con esos datos exactos!');
      console.log(specificRows[0]);
    } else {
      console.log('❌ No se encontró huésped con esos datos exactos');
      console.log('💡 Verifica que los datos coincidan exactamente');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

verificarHuesped();
