import mysql from 'mysql2/promise';

const passwords = ['', '0000', 'root', 'password', 'mysql', '123456', 'admin'];

async function testPassword(password) {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password,
      database: 'reservas_restaurante'
    });
    
    console.log(`✅ ¡Conexión exitosa con contraseña: "${password}"`);
    await connection.end();
    return password;
  } catch (error) {
    console.log(`❌ Falló con contraseña: "${password}"`);
    return null;
  }
}

async function findCorrectPassword() {
  console.log('🔍 Probando diferentes contraseñas...\n');
  
  for (const password of passwords) {
    const result = await testPassword(password);
    if (result !== null) {
      return result;
    }
  }
  
  console.log('\n❌ No se encontró una contraseña válida entre las opciones comunes.');
  console.log('Por favor verifica en MySQL Workbench con qué credenciales te conectas.');
  return null;
}

findCorrectPassword();
