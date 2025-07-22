const mysql = require('mysql2/promise');

async function testInsert() {
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
    const [result] = await pool.execute(
      `INSERT INTO Reserva (id_huesped, id_horario, fecha_reserva, num_personas, alergias, estado, confirmacion) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        1, // id_huesped (ajusta según tus datos reales)
        1, // id_horario (ajusta según tus datos reales)
        '2025-07-22', // fecha_reserva
        2, // num_personas
        'Ninguna', // alergias
        'Pendiente', // estado
        false // confirmacion
      ]
    );
    console.log('Filas insertadas:', result.affectedRows);
  } catch (error) {
    console.error('Error al insertar:', error);
  } finally {
    await pool.end();
  }
}

testInsert();
