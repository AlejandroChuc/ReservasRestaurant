import { cancelReservationUseCase } from "../../application/usecases/cancelReservation";
import { ReservaMySQLDataSource } from "../data/ReservaMySQLDataSource";
module.exports = async function (req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }
    const { reservation_number } = req.body;
    if (!reservation_number) {
        return res.status(400).json({ error: "Falta número de reserva" });
    }
    const success = await cancelReservationUseCase(reservation_number, new ReservaMySQLDataSource());
    if (!success) {
        return res.status(404).json({ error: "Reserva no encontrada" });
    }
    return res.status(200).json({ success: true });
};
