import type { ReservaRepository } from "../../domain/repositories/ReservaRepository";

// Simulación de base de datos en memoria
const reservasDB: { reservationNumber: string; status: string }[] = [];

export class ReservaDataSource implements ReservaRepository {
  async cancelReservation(reservationNumber: string): Promise<boolean> {
    const reserva = reservasDB.find(r => r.reservationNumber === reservationNumber);
    if (!reserva) return false;
    reserva.status = "Cancelada";
    return true;
  }
}
