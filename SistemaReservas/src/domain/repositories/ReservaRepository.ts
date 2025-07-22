export interface ReservaRepository {
  cancelReservation(reservationNumber: string): Promise<boolean>;
}
