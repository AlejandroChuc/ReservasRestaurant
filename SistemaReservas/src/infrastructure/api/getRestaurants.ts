import mysql from "mysql2/promise";
import type { Request, Response } from "express";

module.exports = async function (req: Request, res: Response) {
  if (req.method && req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
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
    const [rows] = await pool.query(
      `SELECT id_restaurante, nombre, descripcion FROM Restaurante`
    );
    await pool.end();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener restaurantes", details: (error as any).message });
  }
}
