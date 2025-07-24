const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root', // Cambia por tu usuario de MySQL
  password: '0000', // Cambia por tu contraseña de MySQL
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