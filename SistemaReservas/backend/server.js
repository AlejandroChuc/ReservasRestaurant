
import express from 'express';
import cors from 'cors';
import { db } from './db/db.js';

const app = express();
app.use(cors());
app.use(express.json());

// --- CRUD Huesped ---
// Crear huesped
app.post('/api/huespedes', async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, num_habitacion, numero_personas, fecha_llegada, fecha_salida, correo } = req.body;
    const [result] = await db.execute(
      `INSERT INTO Huesped (nombre, apellido_paterno, apellido_materno, num_habitacion, numero_personas, fecha_llegada, fecha_salida, correo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, num_habitacion, numero_personas, fecha_llegada, fecha_salida, correo]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error al crear huesped:', error);
    res.status(500).json({ success: false, error: 'Error al crear huesped' });
  }
});

// Obtener todos los huespedes
app.get('/api/huespedes', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Huesped');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener huespedes:', error);
    res.status(500).json({ success: false, error: 'Error al obtener huespedes' });
  }
});

// Obtener huesped por ID
app.get('/api/huespedes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM Huesped WHERE id_huesped = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Huesped no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener huesped:', error);
    res.status(500).json({ success: false, error: 'Error al obtener huesped' });
  }
});

// Actualizar huesped
app.put('/api/huespedes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido_paterno, apellido_materno, num_habitacion, numero_personas, fecha_llegada, fecha_salida, correo } = req.body;
    const [result] = await db.execute(
      `UPDATE Huesped SET nombre=?, apellido_paterno=?, apellido_materno=?, num_habitacion=?, numero_personas=?, fecha_llegada=?, fecha_salida=?, correo=? WHERE id_huesped=?`,
      [nombre, apellido_paterno, apellido_materno, num_habitacion, numero_personas, fecha_llegada, fecha_salida, correo, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Huesped no encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar huesped:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar huesped' });
  }
});

// Eliminar huesped
app.delete('/api/huespedes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM Huesped WHERE id_huesped = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Huesped no encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar huesped:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar huesped' });
  }
});

// --- CRUD Restaurante ---
app.post('/api/restaurantes', async (req, res) => {
  try {
    const { nombre, capacidad_max, descripcion, logo } = req.body;
    const [result] = await db.execute(
      `INSERT INTO Restaurante (nombre, capacidad_max, descripcion, logo) VALUES (?, ?, ?, ?)`,
      [nombre, capacidad_max, descripcion, logo || null]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error al crear restaurante:', error);
    res.status(500).json({ success: false, error: 'Error al crear restaurante' });
  }
});

app.get('/api/restaurantes', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Restaurante');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener restaurantes:', error);
    res.status(500).json({ success: false, error: 'Error al obtener restaurantes' });
  }
});

app.get('/api/restaurantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM Restaurante WHERE id_restaurante = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener restaurante:', error);
    res.status(500).json({ success: false, error: 'Error al obtener restaurante' });
  }
});

app.put('/api/restaurantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, capacidad_max, descripcion, logo } = req.body;
    const [result] = await db.execute(
      `UPDATE Restaurante SET nombre=?, capacidad_max=?, descripcion=?, logo=? WHERE id_restaurante=?`,
      [nombre, capacidad_max, descripcion, logo || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar restaurante:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar restaurante' });
  }
});

app.delete('/api/restaurantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM Restaurante WHERE id_restaurante = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar restaurante:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar restaurante' });
  }
});

// --- CRUD Horario_Restaurante ---
app.post('/api/horarios', async (req, res) => {
  try {
    const { id_restaurante, bloque_comida, hora_inicio, hora_fin } = req.body;
    const [result] = await db.execute(
      `INSERT INTO Horario_Restaurante (id_restaurante, bloque_comida, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)`,
      [id_restaurante, bloque_comida, hora_inicio, hora_fin]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ success: false, error: 'Error al crear horario' });
  }
});

app.get('/api/horarios', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Horario_Restaurante');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ success: false, error: 'Error al obtener horarios' });
  }
});

app.get('/api/horarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM Horario_Restaurante WHERE id_horario = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Horario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener horario:', error);
    res.status(500).json({ success: false, error: 'Error al obtener horario' });
  }
});

app.put('/api/horarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_restaurante, bloque_comida, hora_inicio, hora_fin } = req.body;
    const [result] = await db.execute(
      `UPDATE Horario_Restaurante SET id_restaurante=?, bloque_comida=?, hora_inicio=?, hora_fin=? WHERE id_horario=?`,
      [id_restaurante, bloque_comida, hora_inicio, hora_fin, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Horario no encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar horario' });
  }
});

app.delete('/api/horarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM Horario_Restaurante WHERE id_horario = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Horario no encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar horario' });
  }
});

// --- CRUD Colaborador ---
app.post('/api/colaboradores', async (req, res) => {
  try {
    const { nombre, usuario, contrasena } = req.body;
    const [result] = await db.execute(
      `INSERT INTO Colaborador (nombre, usuario, contrasena) VALUES (?, ?, ?)`,
      [nombre, usuario, contrasena]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error al crear colaborador:', error);
    res.status(500).json({ success: false, error: 'Error al crear colaborador' });
  }
});

app.get('/api/colaboradores', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Colaborador');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener colaboradores:', error);
    res.status(500).json({ success: false, error: 'Error al obtener colaboradores' });
  }
});

app.get('/api/colaboradores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM Colaborador WHERE id_colaborador = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Colaborador no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener colaborador:', error);
    res.status(500).json({ success: false, error: 'Error al obtener colaborador' });
  }
});

app.put('/api/colaboradores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, usuario, contrasena } = req.body;
    const [result] = await db.execute(
      `UPDATE Colaborador SET nombre=?, usuario=?, contrasena=? WHERE id_colaborador=?`,
      [nombre, usuario, contrasena, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Colaborador no encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar colaborador:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar colaborador' });
  }
});

app.delete('/api/colaboradores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM Colaborador WHERE id_colaborador = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Colaborador no encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar colaborador:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar colaborador' });
  }
});

// Crear una reserva
app.post('/api/reservas', async (req, res) => {
  try {
    const {
      customerName,
      email,
      restaurant,
      date,
      time,
      numberOfPeople,
      roomNumber,
      reservationNumber,
      specialRequests,
      allergies,
    } = req.body;

    const [result] = await db.execute(
      `INSERT INTO reservas 
        (customer_name, email, restaurant, date, time, number_of_people, room_number, reservation_number, special_requests, allergies)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerName,
        email,
        restaurant,
        date,
        time,
        numberOfPeople,
        roomNumber,
        reservationNumber,
        specialRequests || '',
        allergies || '',
      ]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ success: false, error: 'Error al crear reserva' });
  }
});

// Obtener todas las reservas
app.get('/api/reservas', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM reservas');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ success: false, error: 'Error al obtener reservas' });
  }
});

// Obtener una reserva por ID
app.get('/api/reservas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM reservas WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Reserva no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({ success: false, error: 'Error al obtener reserva' });
  }
});

// Actualizar una reserva por ID
app.put('/api/reservas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      email,
      restaurant,
      date,
      time,
      numberOfPeople,
      roomNumber,
      reservationNumber,
      specialRequests,
      allergies,
    } = req.body;

    const [result] = await db.execute(
      `UPDATE reservas SET customer_name=?, email=?, restaurant=?, date=?, time=?, number_of_people=?, room_number=?, reservation_number=?, special_requests=?, allergies=? WHERE id=?`,
      [
        customerName,
        email,
        restaurant,
        date,
        time,
        numberOfPeople,
        roomNumber,
        reservationNumber,
        specialRequests || '',
        allergies || '',
        id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Reserva no encontrada' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar reserva' });
  }
});

// Eliminar una reserva por ID
app.delete('/api/reservas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM reservas WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Reserva no encontrada' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar reserva' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
