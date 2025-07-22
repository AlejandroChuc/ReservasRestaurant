import mysql from "mysql2/promise";
module.exports = async function (req, res) {
    if (req.method && req.method !== "GET") {
        return res.status(405).json({ error: "Método no permitido" });
    }
    const restauranteId = req.query.restauranteId;
    if (!restauranteId) {
        return res.status(400).json({ error: "restauranteId es requerido" });
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
        const [rows] = await pool.query(`SELECT id_horario, bloque_comida, hora_inicio, hora_fin FROM Horario_Restaurante WHERE id_restaurante = ?`, [restauranteId]);
        await pool.end();
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener horarios", details: error.message });
    }
};
