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
const initialReservations: Reservation[] = [];

export function GlobalReservationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Cargar reservas desde localStorage si existen
  const getInitialReservations = () => {
    const stored = localStorage.getItem("rcd_reservas");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialReservations;
      }
    }
    return initialReservations;
  };

  const [allReservations, setAllReservations] = useState<Reservation[]>(getInitialReservations());

  const addReservation = (reservationData: Omit<Reservation, "id">) => {
    console.log("addReservation llamada con datos:", reservationData);
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(), // En producción usarías un UUID
    };
    console.log("Nueva reserva con ID:", newReservation);
    setAllReservations((prev) => {
      const updated = [...prev, newReservation];
      // Guardar en localStorage
      localStorage.setItem("rcd_reservas", JSON.stringify(updated));
      console.log("Reservas actualizadas:", updated);
      return updated;
    });
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setAllReservations((prev) => {
      const updated = prev.map((reservation) =>
        reservation.id === id ? { ...reservation, ...updates } : reservation
      );
      localStorage.setItem("rcd_reservas", JSON.stringify(updated));
      return updated;
    });
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
