import mysql from 'mysql2/promise';

async function testInsert() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reservas_restaurante',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    const [result] = await pool.execute(
      `INSERT INTO reservas (numero_reserva, nombre_cliente, correo_cliente, fecha, hora, cantidad_personas, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'TEST123',
        'Prueba Copilot',
        'prueba@correo.com',
        '2025-07-22',
        '20:00',
        2,
        'Pendiente'
      ]
    );
    // @ts-ignore
    console.log('Filas insertadas:', result.affectedRows);
  } catch (error) {
    console.error('Error al insertar:', error);
  } finally {
    await pool.end();
  }
}

testInsert();
