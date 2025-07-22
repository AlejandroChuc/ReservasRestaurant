import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);

  // Cargar reservas desde la base de datos al montar el provider
  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await fetch("/api/getReservations");
        const data = await res.json();
        setAllReservations(data);
      } catch (error) {
        console.error("Error al cargar reservas desde la base de datos:", error);
      }
    }
    fetchReservations();
  }, []);

  // Métodos vacíos o de solo lectura, ya que la edición se hará vía API
  const addReservation = () => {
    throw new Error("addReservation solo disponible vía backend/API");
  };
  const updateReservation = () => {
    throw new Error("updateReservation solo disponible vía backend/API");
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
