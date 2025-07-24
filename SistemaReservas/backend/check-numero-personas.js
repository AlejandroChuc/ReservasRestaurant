import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bizcocho-8',
  database: 'reservas_restaurante'
});

console.log('=== VERIFICANDO CAMPO numero_personas ===');
const [rows] = await connection.execute('SELECT id_huesped, nombre, apellido_paterno, apellido_materno, num_habitacion, numero_personas, correo FROM Huesped WHERE nombre = "Fernando"');

if (rows.length > 0) {
  const guest = rows[0];
  console.log('Datos del huésped Fernando:');
  console.log(`numero_personas en BD: ${guest.numero_personas} (tipo: ${typeof guest.numero_personas})`);
  console.log(`numero_personas enviado desde frontend: 2 (tipo: number)`);
  console.log(`¿Son iguales? ${guest.numero_personas == 2} (== comparación)`);
  console.log(`¿Son estrictamente iguales? ${guest.numero_personas === 2} (=== comparación)`);
} else {
  console.log('No se encontró el huésped Fernando');
}

await connection.end();
