import { createContext, useContext, useState, type ReactNode } from "react";
import type { Reservation } from "../types";

interface GlobalReservationsContextType {
  allReservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, "id">) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  getReservationById: (id: string) => Reservation | undefined;
}

const GlobalReservationsContext = createContext<
  GlobalReservationsContextType | undefined
>(undefined);

// Datos iniciales de ejemplo
const initialReservations: Reservation[] = [
  {
    id: "1",
    guestName: "María González",
    roomNumber: "205",
    numberOfPeople: 4,
    restaurant: "Eden Roc",
    date: "2024-01-15",
    time: "19:30",
    mealBlock: "cena",
    status: "confirmada",
    arrivalConfirmed: false,
    mealCompleted: false,
  },
  {
    id: "2",
    guestName: "Carlos Rodríguez",
    roomNumber: "312",
    numberOfPeople: 2,
    restaurant: "Nobu Hotel",
    date: "2024-01-15",
    time: "13:00",
    mealBlock: "comida",
    status: "confirmada",
    arrivalConfirmed: true,
    mealCompleted: false,
    arrivalTime: "13:05",
  },
  {
    id: "3",
    guestName: "Ana Martínez",
    roomNumber: "108",
    numberOfPeople: 6,
    restaurant: "Unico",
    date: "2024-01-16",
    time: "08:45",
    mealBlock: "desayuno",
    status: "confirmada",
    arrivalConfirmed: true,
    mealCompleted: true,
    arrivalTime: "08:50",
    departureTime: "09:45",
  },
];

export function GlobalReservationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [allReservations, setAllReservations] =
    useState<Reservation[]>(initialReservations);

  const addReservation = (reservationData: Omit<Reservation, "id">) => {
    console.log("addReservation llamada con datos:", reservationData);
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(), // En producción usarías un UUID
    };
    console.log("Nueva reserva con ID:", newReservation);
    setAllReservations((prev) => {
      const updated = [...prev, newReservation];
      console.log("Reservas actualizadas:", updated);
      return updated;
    });
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setAllReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id ? { ...reservation, ...updates } : reservation
      )
    );
  };

  const getReservationById = (id: string) => {
    return allReservations.find((reservation) => reservation.id === id);
  };

  return (
    <GlobalReservationsContext.Provider
      value={{
        allReservations,
        addReservation,
        updateReservation,
        getReservationById,
      }}
    >
      {children}
    </GlobalReservationsContext.Provider>
  );
}

export function useGlobalReservations() {
  const context = useContext(GlobalReservationsContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalReservations must be used within a GlobalReservationsProvider"
    );
  }
  return context;
}
