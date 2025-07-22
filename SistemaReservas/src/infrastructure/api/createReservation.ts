import mysql from "mysql2/promise";
import type { Request, Response } from "express";

module.exports = async function (req: Request, res: Response) {
  if (req.method && req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    id_huesped,
    id_horario,
    fecha_reserva,
    num_personas,
    alergias,
    estado,
    confirmacion
  } = req.body;

  if (!id_huesped || !id_horario || !fecha_reserva || !num_personas || !alergias || !estado) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "0000",
      database: "reservas_restaurante",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    await pool.execute(
      `INSERT INTO Reserva (id_huesped, id_horario, fecha_reserva, num_personas, alergias, estado, confirmacion) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_huesped, id_horario, fecha_reserva, num_personas, alergias, estado, confirmacion ?? false]
    );

    await pool.end();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar la reserva", details: (error as any).message });
  }
}
