import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bizcocho-8',
  database: 'reservas_restaurante'
});

console.log('=== HUÉSPEDES EN LA BASE DE DATOS ===');
const [rows] = await connection.execute('SELECT * FROM Huesped');

rows.forEach((row, index) => {
  console.log(`\nHuésped ${index + 1}:`);
  console.log(`ID: ${row.id_huesped}`);
  console.log(`Nombre: ${row.nombre}`);
  console.log(`Apellido Paterno: ${row.apellido_paterno}`);
  console.log(`Apellido Materno: ${row.apellido_materno}`);
  console.log(`Habitación: ${row.num_habitacion}`);
  console.log(`Correo: ${row.correo}`);
  console.log(`Fecha llegada: ${row.fecha_llegada}`);
  console.log(`Fecha salida: ${row.fecha_salida}`);
});

console.log('\n=== DATOS QUE ENVÍAS DESDE EL FRONTEND ===');
console.log('Nombre: Fernando');
console.log('Apellido Paterno: May');
console.log('Apellido Materno: Bustos');
console.log('Habitación: 456');
console.log('Correo: fernando.may@test.com');

await connection.end();
