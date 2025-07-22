export async function cancelReservationUseCase(reservationNumber, repository) {
    return repository.cancelReservation(reservationNumber);
}
