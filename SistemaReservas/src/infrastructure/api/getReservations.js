import mysql from "mysql2/promise";
module.exports = async function (req, res) {
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
        const [rows] = await pool.query(`SELECT r.id_reserva, r.fecha_reserva, r.num_personas, r.alergias, r.estado, r.confirmacion,
              h.nombre AS nombre_huesped, h.apellido_paterno, h.apellido_materno, h.num_habitacion,
              hr.bloque_comida, hr.hora_inicio, hr.hora_fin, rest.nombre AS nombre_restaurante
         FROM Reserva r
         JOIN Huesped h ON r.id_huesped = h.id_huesped
         JOIN Horario_Restaurante hr ON r.id_horario = hr.id_horario
         JOIN Restaurante rest ON hr.id_restaurante = rest.id_restaurante`);
        // Mapear los campos de la base de datos al formato que espera el frontend
        const mapped = Array.isArray(rows) ? rows.map((row) => ({
            id: row.id_reserva.toString(),
            guestName: `${row.nombre_huesped} ${row.apellido_paterno} ${row.apellido_materno}`,
            roomNumber: row.num_habitacion,
            numberOfPeople: row.num_personas,
            restaurant: row.nombre_restaurante,
            date: row.fecha_reserva,
            time: row.hora_inicio ? row.hora_inicio.substring(0, 5) : '',
            mealBlock: row.bloque_comida ? row.bloque_comida.toLowerCase() : '',
            status: row.estado ? row.estado.toLowerCase() : 'pendiente',
            arrivalConfirmed: !!row.confirmacion,
            mealCompleted: false,
            arrivalTime: '',
            departureTime: '',
            specialRequests: '',
            allergies: row.alergias,
            email: '',
        })) : [];
        await pool.end();
        res.status(200).json(mapped);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener reservas", details: error.message });
    }
};
