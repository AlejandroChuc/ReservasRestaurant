const mysql = require('mysql2/promise');

async function poblarRestaurantesYHorarios() {
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
    // Restaurantes y horarios
    const restaurantes = [
      {
        nombre: 'ZEN',
        descripcion: 'Encuentra tu Zen en nuestro punto de moda de temática asiática. Zen ofrece una extraordinaria experiencia gastronómica compuesta por cocina asiática preparada por expertos. Durante la noche, saboree especialidades asiáticas como el Teppanyaki.',
        horarios: [
          { bloque: 'Cena', inicio: '18:00', fin: '22:30' }
        ]
      },
      {
        nombre: 'CIAO',
        descripcion: 'Siéntese a disfrutar de un festín italiano en nuestro propio lugar para cenar. Por las mañanas, disfrute de un suntuoso desayuno de comida internacional. Por la noche, el restaurante se convierte en un escenario deslumbrante para saborear las mejores especialidades italianas.',
        horarios: [
          { bloque: 'Desayuno', inicio: '07:00', fin: '11:00' },
          { bloque: 'Comida', inicio: '12:00', fin: '15:30' },
          { bloque: 'Cena', inicio: '18:00', fin: '22:30' }
        ]
      },
      {
        nombre: 'TORO',
        descripcion: 'Cuando el sol se pone en el mar Caribe, Toro es el lugar ideal para disfrutar de una experiencia elegante y auténtica en un asador. Deléitese con los mejores cortes de carne de res, cerdo, aves y más, cocinados frescos en spitfire solo para usted mientras contempla la playa. Disfrute de noches románticas a la luz de la luna con una copa de vino tinto.',
        horarios: [
          { bloque: 'Cena', inicio: '18:00', fin: '22:30' }
        ]
      },
      {
        nombre: 'ISLA SUR',
        descripcion: 'El restaurante Isla Sur ofrece un paraíso para los entusiastas de los mariscos, ya que ofrece una exquisita variedad de platos elaborados con los mejores ingredientes de origen sostenible.',
        horarios: [
          { bloque: 'Cena', inicio: '17:00', fin: '22:00' }
        ]
      },
      {
        nombre: 'FRIDA',
        descripcion: 'Descubre los ardientes sabores, especias y pasiones de México en Frida, en un ambiente festivo. Nuestro buffet ofrece especialidades internacionales, acompañadas de sabrosas margaritas y tequilas.',
        horarios: [
          { bloque: 'Desayuno', inicio: '07:00', fin: '11:00' },
          { bloque: 'Comida', inicio: '12:00', fin: '16:00' },
          { bloque: 'Cena', inicio: '18:00', fin: '22:30' }
        ]
      }
    ];

    for (const rest of restaurantes) {
      const [restResult] = await pool.execute(
        `INSERT INTO Restaurante (nombre, descripción) VALUES (?, ?)`,
        [rest.nombre, rest.descripcion]
      );
      const id_restaurante = restResult.insertId;
      for (const horario of rest.horarios) {
        await pool.execute(
          `INSERT INTO Horario_Restaurante (id_restaurante, bloque_comida, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)`,
          [id_restaurante, horario.bloque, horario.inicio, horario.fin]
        );
      }
      console.log(`Restaurante y horarios insertados: ${rest.nombre}`);
    }
  } catch (error) {
    console.error('Error al poblar restaurantes y horarios:', error);
  } finally {
    await pool.end();
  }
}

poblarRestaurantesYHorarios();
