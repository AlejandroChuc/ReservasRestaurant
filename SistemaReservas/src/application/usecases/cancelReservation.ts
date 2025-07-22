import type { ReservaRepository } from "../../domain/repositories/ReservaRepository";

export async function cancelReservationUseCase(reservationNumber: string, repository: ReservaRepository): Promise<boolean> {
  return repository.cancelReservation(reservationNumber);
}
