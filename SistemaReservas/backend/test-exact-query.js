import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bizcocho-8',
  database: 'reservas_restaurante'
});

// Datos exactos del frontend
const formData = {
  nombre: 'Fernando',
  apellido_paterno: 'May',
  apellido_materno: 'Bustos',
  num_habitacion: '456',
  numero_personas: 2,
  correo: 'fernando.may@test.com'
};

console.log('=== SIMULANDO LA QUERY EXACTA DEL BACKEND ===');
console.log('Datos a buscar:', formData);

const [rows] = await connection.execute(
  `SELECT id_huesped, nombre, apellido_paterno, apellido_materno, num_habitacion, 
          numero_personas, fecha_llegada, fecha_salida, correo
   FROM Huesped 
   WHERE nombre = ? AND apellido_paterno = ? AND apellido_materno = ? 
   AND num_habitacion = ? AND numero_personas = ? AND correo = ?`,
  [formData.nombre, formData.apellido_paterno, formData.apellido_materno, 
   formData.num_habitacion, formData.numero_personas, formData.correo]
);

console.log(`\nResultados encontrados: ${rows.length}`);
if (rows.length > 0) {
  console.log('✅ ÉXITO - Huésped encontrado:', rows[0]);
} else {
  console.log('❌ FALLO - No se encontró el huésped');
  
  // Vamos a probar cada campo individualmente
  console.log('\n=== PROBANDO CADA CAMPO INDIVIDUALMENTE ===');
  
  const [byName] = await connection.execute('SELECT * FROM Huesped WHERE nombre = ?', [formData.nombre]);
  console.log(`Por nombre: ${byName.length} encontrados`);
  
  const [byLastName] = await connection.execute('SELECT * FROM Huesped WHERE apellido_paterno = ?', [formData.apellido_paterno]);
  console.log(`Por apellido paterno: ${byLastName.length} encontrados`);
  
  const [byRoom] = await connection.execute('SELECT * FROM Huesped WHERE num_habitacion = ?', [formData.num_habitacion]);
  console.log(`Por habitación: ${byRoom.length} encontrados`);
  
  const [byEmail] = await connection.execute('SELECT * FROM Huesped WHERE correo = ?', [formData.correo]);
  console.log(`Por correo: ${byEmail.length} encontrados`);
  
  const [byPersons] = await connection.execute('SELECT * FROM Huesped WHERE numero_personas = ?', [formData.numero_personas]);
  console.log(`Por número de personas: ${byPersons.length} encontrados`);
}

await connection.end();
