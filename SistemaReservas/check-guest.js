// Verificar datos específicos del huésped Fernando May Bustos
import mysql from 'mysql2/promise';

async function checkGuest() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Bizcocho-8',
      database: 'reservas_restaurante'
    });

    console.log('🔍 Verificando tabla Huesped...');
    
    // Contar total de huéspedes
    const [count] = await connection.execute('SELECT COUNT(*) as total FROM Huesped');
    console.log(`📊 Total de huéspedes en la BD: ${count[0].total}`);

    if (count[0].total > 0) {
      // Mostrar todos los huéspedes
      console.log('\n📋 Lista de todos los huéspedes:');
      const [guests] = await connection.execute(`
        SELECT id_huesped, nombre, apellido_paterno, apellido_materno, 
               num_habitacion, numero_personas, correo 
        FROM Huesped
      `);
      
      guests.forEach((guest, index) => {
        console.log(`${index + 1}. ID: ${guest.id_huesped}`);
        console.log(`   Nombre: ${guest.nombre} ${guest.apellido_paterno} ${guest.apellido_materno}`);
        console.log(`   Habitación: ${guest.num_habitacion}`);
        console.log(`   Personas: ${guest.numero_personas}`);
        console.log(`   Correo: ${guest.correo}`);
        console.log('   ---');
      });

      // Buscar específicamente a Fernando May Bustos
      console.log('\n🔍 Buscando a Fernando May Bustos...');
      const [fernando] = await connection.execute(`
        SELECT * FROM Huesped 
        WHERE nombre = 'Fernando' 
        AND apellido_paterno = 'May' 
        AND apellido_materno = 'Bustos'
      `);

      if (fernando.length > 0) {
        console.log('✅ Fernando May Bustos encontrado:');
        console.log(fernando[0]);
      } else {
        console.log('❌ Fernando May Bustos NO encontrado');
        
        // Buscar coincidencias parciales
        console.log('\n🔍 Buscando coincidencias parciales...');
        const [partial] = await connection.execute(`
          SELECT * FROM Huesped 
          WHERE nombre LIKE '%Fernando%' 
          OR apellido_paterno LIKE '%May%' 
          OR apellido_materno LIKE '%Bustos%'
        `);
        
        if (partial.length > 0) {
          console.log('📝 Coincidencias parciales encontradas:');
          partial.forEach(guest => {
            console.log(`- ${guest.nombre} ${guest.apellido_paterno} ${guest.apellido_materno} (Hab: ${guest.num_habitacion})`);
          });
        }
      }
    } else {
      console.log('❌ No hay huéspedes en la base de datos');
      console.log('💡 Necesitas agregar datos de prueba primero');
    }

    await connection.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkGuest();
