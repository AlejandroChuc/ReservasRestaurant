import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // tu usuario
  password: '0000', // tu contraseña
  database: 'reservas_restaurante', // tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
});
