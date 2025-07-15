"use client";

import { useState, useMemo } from "react";
import type { Reservation } from "../../../types";
import { Dialog } from "@headlessui/react";
import { Search } from "lucide-react";
import { DashboardHeader } from "../../components/Colaborador/dashboard-header";
import { ReservationFilters } from "../../components/Colaborador/reservation-filters";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, CheckCircle, LogOut } from "lucide-react";
import type { User } from "../../../types";
import { useGlobalReservations } from "../../../context/GlobalReservationsContext";

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { allReservations, updateReservation } = useGlobalReservations();
  console.log("Dashboard rendered, reservas actuales:", allReservations.length);
  console.log("Contenido actual de allReservations:", allReservations);

  // Filtros iniciales vacíos para mostrar todas las reservas
  const [filters, setFilters] = useState({
    restaurant: "",
    date: "",
    status: "",
    search: "",
    mealBlock: "",
    arrivalStatus: "",
    serviceStatus: ""
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
        reservation.restaurant.toLowerCase().includes(filters.restaurant.toLowerCase());
      const matchesDate = !filters.date || reservation.date === filters.date;
      const matchesStatus =
        !filters.status || reservation.status === filters.status;
      const matchesSearch =
        !filters.search ||
        reservation.guestName.toLowerCase().includes(filters.search.toLowerCase());
      const matchesMealBlock =
        !filters.mealBlock || reservation.mealBlock === filters.mealBlock;
      const matchesServiceStatus =
        !filters.serviceStatus ||
        (filters.serviceStatus === "waiting" && !reservation.arrivalConfirmed) ||
        (filters.serviceStatus === "dining" && reservation.arrivalConfirmed && !reservation.mealCompleted) ||
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
              <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white/80 shadow-lg">
                <table className="min-w-full text-sm text-gray-800">
  <thead className="bg-[#f5f6fa] sticky top-0 z-10">
    <tr>
      <th className="px-4 py-3 font-semibold text-left border-b border-gray-200 w-48">Huésped</th>
      <th className="px-4 py-3 font-semibold text-left border-b border-gray-200 w-32">Restaurante</th>
      <th className="px-4 py-3 font-semibold text-left border-b border-gray-200 w-32">Bloque</th>
      <th className="px-4 py-3 font-semibold text-left border-b border-gray-200 w-32">Estado</th>
      <th className="px-4 py-3 font-semibold text-left border-b border-gray-200 w-32">Fecha</th>
      <th className="px-4 py-3 font-semibold text-left border-b border-gray-200 w-40">Servicio y Acciones</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {filteredReservations.map((reservation) => (
      <tr key={reservation.id} className="hover:bg-[#f0f4fa] transition-all">
        <td className="px-4 py-2 font-medium flex items-center gap-2">
          {reservation.guestName}
          <button
            title="Ver detalles"
            className="ml-2 flex items-center gap-1 px-2 py-1 rounded-full border border-slate-300 bg-white hover:bg-slate-100 transition text-slate-700 text-xs font-semibold"
            onClick={() => {
              setSelectedReservation(reservation);
              setIsModalOpen(true);
            }}
          >
            <Search className="w-4 h-4 text-slate-600" />
            <span>Detalles</span>
          </button>
        </td>
        <td className="px-4 py-2">
          <span className="inline-block px-2 py-1 rounded bg-orange-100 text-orange-700 font-semibold text-xs">{reservation.restaurant}</span>
        </td>
        <td className="px-4 py-2 capitalize">
          <span className={`inline-block px-2 py-1 rounded font-semibold text-xs ${reservation.mealBlock === 'desayuno' ? 'bg-yellow-100 text-yellow-800' : reservation.mealBlock === 'comida' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{reservation.mealBlock}</span>
        </td>
        <td className="px-4 py-2">
          <span className={`inline-block px-2 py-1 rounded font-bold text-xs ${reservation.status === 'confirmada' ? 'bg-green-200 text-green-800' : reservation.status === 'cancelada' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'}`}>{reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}</span>
          {reservation.mealCompleted && (
            <span className="ml-2 inline-block px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800">Comida Finalizada</span>
          )}
          {reservation.arrivalConfirmed && !reservation.mealCompleted && (
            <span className="ml-2 inline-block px-2 py-1 rounded text-xs font-bold bg-orange-200 text-orange-800">En Restaurante</span>
          )}
        </td>
        <td className="px-4 py-2">{reservation.date}</td>
        <td className="px-4 py-2 space-x-2">
          {reservation.status === 'confirmada' && !reservation.arrivalConfirmed && (
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-semibold transition-all shadow"
              onClick={() => handleConfirmArrival(reservation.id)}
            >
              Confirmar Llegada
            </button>
          )}
          {reservation.arrivalConfirmed && !reservation.mealCompleted && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold transition-all shadow"
              onClick={() => handleCompleteMeal(reservation.id)}
            >
              Finalizar Comida
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
