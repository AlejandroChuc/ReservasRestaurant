"use client";

import { useState, useMemo } from "react";
import { DashboardHeader } from "../../components/Colaborador/dashboard-header";
import { ReservationFilters } from "../../components/Colaborador/reservation-filters";
import { ReservationCard } from "../../components/Colaborador/reservation-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, CheckCircle, LogOut } from "lucide-react";
import type { User } from "../../../types";
import { useGlobalReservations } from "../../../context/GlobalReservationsContext";

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { allReservations, updateReservation } = useGlobalReservations();
  console.log("Dashboard rendered, reservas actuales:", allReservations.length);

  const [filters, setFilters] = useState({
    restaurant: "",
    date: "",
    status: "",
    search: "",
    mealBlock: "",
    arrivalStatus: "",
    serviceStatus: "",
  });

  const handleConfirmArrival = (reservationId: string) => {
    updateReservation(reservationId, {
      arrivalConfirmed: true,
      arrivalTime: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  const handleCompleteMeal = (reservationId: string) => {
    updateReservation(reservationId, {
      mealCompleted: true,
      departureTime: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  const filteredReservations = useMemo(() => {
    return allReservations.filter((reservation) => {
      const matchesRestaurant =
        !filters.restaurant ||
        reservation.restaurant
          .toLowerCase()
          .includes(filters.restaurant.toLowerCase());
      const matchesDate = !filters.date || reservation.date === filters.date;
      const matchesStatus =
        !filters.status || reservation.status === filters.status;
      const matchesSearch =
        !filters.search ||
        reservation.guestName
          .toLowerCase()
          .includes(filters.search.toLowerCase());
      const matchesMealBlock =
        !filters.mealBlock || reservation.mealBlock === filters.mealBlock;

      const matchesServiceStatus =
        !filters.serviceStatus ||
        (filters.serviceStatus === "waiting" &&
          !reservation.arrivalConfirmed) ||
        (filters.serviceStatus === "dining" &&
          reservation.arrivalConfirmed &&
          !reservation.mealCompleted) ||
        (filters.serviceStatus === "completed" && reservation.mealCompleted);

      return (
        matchesRestaurant &&
        matchesDate &&
        matchesStatus &&
        matchesSearch &&
        matchesMealBlock &&
        matchesServiceStatus
      );
    });
  }, [filters, allReservations]);

  const stats = useMemo(() => {
    const total = filteredReservations.length;
    const confirmed = filteredReservations.filter(
      (r) => r.status === "confirmada"
    ).length;
    const totalGuests = filteredReservations.reduce(
      (sum, r) => sum + r.numberOfPeople,
      0
    );
    const currentlyDining = filteredReservations.filter(
      (r) => r.arrivalConfirmed && !r.mealCompleted
    ).length;
    const completedMeals = filteredReservations.filter(
      (r) => r.mealCompleted
    ).length;

    return { total, confirmed, totalGuests, currentlyDining, completedMeals };
  }, [filteredReservations]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#3A4A5C" }}>
      <DashboardHeader user={user} onLogout={onLogout} />

      <main className="p-6 space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border-0" style={{ backgroundColor: "#4A5A6C" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Reservas
              </CardTitle>
              <CalendarDays className="h-4 w-4" style={{ color: "#FF8C00" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <p className="text-xs text-gray-300">Reservas filtradas</p>
            </CardContent>
          </Card>

          <Card className="border-0" style={{ backgroundColor: "#4A5A6C" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Confirmadas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {stats.confirmed}
              </div>
              <p className="text-xs text-gray-300">Reservas confirmadas</p>
            </CardContent>
          </Card>

          <Card className="border-0" style={{ backgroundColor: "#4A5A6C" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Comiendo Ahora
              </CardTitle>
              <Users className="h-4 w-4" style={{ color: "#FF8C00" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "#FF8C00" }}>
                {stats.currentlyDining}
              </div>
              <p className="text-xs text-gray-300">En el restaurante</p>
            </CardContent>
          </Card>

          <Card className="border-0" style={{ backgroundColor: "#4A5A6C" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Finalizadas
              </CardTitle>
              <LogOut className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {stats.completedMeals}
              </div>
              <p className="text-xs text-gray-300">Comidas completadas</p>
            </CardContent>
          </Card>

          <Card className="border-0" style={{ backgroundColor: "#4A5A6C" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Huéspedes
              </CardTitle>
              <Users className="h-4 w-4" style={{ color: "#FF8C00" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalGuests}
              </div>
              <p className="text-xs text-gray-300">Personas en reservas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <ReservationFilters onFilterChange={setFilters} />

        {/* Lista de Reservas */}
        <Card className="border-0" style={{ backgroundColor: "#4A5A6C" }}>
          <CardHeader>
            <CardTitle className="text-white">
              Reservas ({filteredReservations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReservations.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <p>No se encontraron reservas con los filtros aplicados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onConfirmArrival={handleConfirmArrival}
                    onCompleteMeal={handleCompleteMeal}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
