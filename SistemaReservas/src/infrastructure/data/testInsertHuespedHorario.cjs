const mysql = require('mysql2/promise');

async function insertHuespedYHorario() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'reservas_restaurante',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    // Insertar huésped de prueba
    const [huespedResult] = await pool.execute(
      `INSERT INTO Huesped (nombre, apellido_paterno, apellido_materno, num_habitacion, numero_personas, fecha_llegada, fecha_salida, correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Prueba', 'Copilot', 'Test', '101', 2, '2025-07-22', '2025-07-23', 'prueba@correo.com']
    );
    const id_huesped = huespedResult.insertId;
    console.log('ID huésped insertado:', id_huesped);

    // Insertar restaurante de prueba
    const [restauranteResult] = await pool.execute(
      `INSERT INTO Restaurante (nombre, descripción) VALUES (?, ?)`,
      ['Restaurante Copilot', 'Restaurante de prueba']
    );
    const id_restaurante = restauranteResult.insertId;
    console.log('ID restaurante insertado:', id_restaurante);

    // Insertar horario de prueba
    const [horarioResult] = await pool.execute(
      `INSERT INTO Horario_Restaurante (id_restaurante, bloque_comida, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)`,
      [id_restaurante, 'Cena', '20:00', '22:00']
    );
    const id_horario = horarioResult.insertId;
    console.log('ID horario insertado:', id_horario);
  } catch (error) {
    console.error('Error al insertar huésped/horario:', error);
  } finally {
    await pool.end();
  }
}

insertHuespedYHorario();
