const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '3306',
  user: 'root', // Cambia por tu usuario de MySQL
  password: 'Bizcocho-8', // Cambia por tu contraseña de MySQL
  database: 'reservas_restaurante'
});
    
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL!');
});

module.exports = connection;