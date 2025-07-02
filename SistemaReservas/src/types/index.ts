export interface Reservation {
  id: string
  guestName: string
  roomNumber: string
  numberOfPeople: number
  restaurant: string
  date: string
  time: string
  mealBlock: "desayuno" | "comida" | "cena"
  status: "confirmada" | "cancelada" | "expirada"
  arrivalConfirmed: boolean
  mealCompleted: boolean
  arrivalTime?: string
  departureTime?: string
}

export interface User {
  username: string
  name: string
}

export interface ReservationFilters {
  restaurant: string
  date: string
  status: string
  search: string
  mealBlock: string
  arrivalStatus: string
  serviceStatus: string
}
