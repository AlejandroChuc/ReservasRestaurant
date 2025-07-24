import mysql from 'mysql2/promise';

const insertarHorarios = async () => {
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

    // Obtener restaurantes existentes
    const [restaurantes] = await connection.execute('SELECT * FROM Restaurante');
    
    if (restaurantes.length === 0) {
      console.log('❌ No hay restaurantes en la base de datos');
      return;
    }

    console.log(`📋 Encontrados ${restaurantes.length} restaurantes`);

    // Borrar horarios existentes para empezar limpio
    await connection.execute('DELETE FROM Horario_Restaurante');
    console.log('🗑️ Horarios anteriores eliminados');

    // Definir horarios estándar para cada restaurante
    const horariosBase = [
      // Desayuno
      { bloque_comida: 'Desayuno', hora_inicio: '06:00:00', hora_fin: '08:00:00' },
      { bloque_comida: 'Desayuno', hora_inicio: '08:00:00', hora_fin: '10:00:00' },
      { bloque_comida: 'Desayuno', hora_inicio: '10:00:00', hora_fin: '11:30:00' },
      
      // Comida
      { bloque_comida: 'Comida', hora_inicio: '12:00:00', hora_fin: '14:00:00' },
      { bloque_comida: 'Comida', hora_inicio: '14:00:00', hora_fin: '16:00:00' },
      { bloque_comida: 'Comida', hora_inicio: '16:00:00', hora_fin: '17:30:00' },
      
      // Cena
      { bloque_comida: 'Cena', hora_inicio: '18:00:00', hora_fin: '20:00:00' },
      { bloque_comida: 'Cena', hora_inicio: '20:00:00', hora_fin: '22:00:00' },
      { bloque_comida: 'Cena', hora_inicio: '22:00:00', hora_fin: '23:30:00' }
    ];

    let totalInsertados = 0;

    // Insertar horarios para cada restaurante
    for (const restaurante of restaurantes) {
      console.log(`📅 Insertando horarios para ${restaurante.nombre}...`);
      
      for (const horario of horariosBase) {
        const [result] = await connection.execute(
          `INSERT INTO Horario_Restaurante (id_restaurante, bloque_comida, hora_inicio, hora_fin)
           VALUES (?, ?, ?, ?)`,
          [restaurante.id_restaurante, horario.bloque_comida, horario.hora_inicio, horario.hora_fin]
        );
        totalInsertados++;
      }
    }

    console.log(`✅ ${totalInsertados} horarios insertados exitosamente`);

    // Verificar los horarios insertados
    const [verificacion] = await connection.execute(`
      SELECT 
        hr.*,
        r.nombre as restaurante_nombre
      FROM Horario_Restaurante hr
      JOIN Restaurante r ON hr.id_restaurante = r.id_restaurante
      ORDER BY r.nombre, 
        CASE hr.bloque_comida 
          WHEN 'Desayuno' THEN 1 
          WHEN 'Comida' THEN 2 
          WHEN 'Cena' THEN 3 
        END,
        hr.hora_inicio
    `);

    console.log('\n📊 Horarios insertados:');
    verificacion.forEach((horario, index) => {
      console.log(`${index + 1}. ${horario.restaurante_nombre} - ${horario.bloque_comida}: ${horario.hora_inicio.substring(0,5)} - ${horario.hora_fin.substring(0,5)}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 Conexión cerrada');
    }
  }
};

insertarHorarios();
