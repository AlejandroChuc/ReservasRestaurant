import mysql from 'mysql2/promise';

const deleteTestGuest = async () => {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '0000',
      database: 'reservas_restaurante'
    });

    console.log('✅ Conexión exitosa');

    // Primero vemos todos los huéspedes
    const [allGuests] = await connection.execute('SELECT * FROM huesped');
    
    console.log('📋 Huéspedes actuales en la base de datos:');
    allGuests.forEach((guest, index) => {
      console.log(`${index + 1}. ID: ${guest.id}, Nombre: ${guest.nombre_completo || `${guest.nombre} ${guest.apellido_paterno} ${guest.apellido_materno}`}, Email: ${guest.email || guest.correo}, Habitación: ${guest.numero_habitacion || guest.num_habitacion}`);
    });

    // Eliminar el huésped con email fernando.nuevo@gmail.com
    const [deleteResult] = await connection.execute(
      'DELETE FROM huesped WHERE email = ? OR correo = ?',
      ['fernando.nuevo@gmail.com', 'fernando.nuevo@gmail.com']
    );

    if (deleteResult.affectedRows > 0) {
      console.log(`✅ Eliminado ${deleteResult.affectedRows} huésped(es) con email fernando.nuevo@gmail.com`);
    } else {
      console.log('⚠️ No se encontró ningún huésped con ese email para eliminar');
    }

    // Verificar el resultado
    const [remaining] = await connection.execute('SELECT * FROM huesped');
    console.log(`📊 Huéspedes restantes: ${remaining.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 Conexión cerrada');
    }
  }
};

deleteTestGuest();
