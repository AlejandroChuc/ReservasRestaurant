import { useReservation } from "../../../context/ReservationContext";
import { useGlobalReservations } from "../../../context/GlobalReservationsContext";
import { useEffect, useState, useRef } from "react";
import { sendReservationConfirmationEmail, isValidEmail } from "../../../services/emailService";

interface CompletadoPageProps {
  onComplete: () => void;
}

export default function CompletadoPage({ onComplete }: CompletadoPageProps) {
  const { reservationData, resetReservationData } = useReservation();
  const { addReservation } = useGlobalReservations();
  const [reservationNumber, setReservationNumber] = useState("");
  const hasAddedReservation = useRef(false);

  useEffect(() => {
    if (reservationData.restaurant && reservationData.customerName && !hasAddedReservation.current) {
      hasAddedReservation.current = true;
      const newReservationNumber = `RES-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;
      setReservationNumber(newReservationNumber);

      const getMealBlock = (time: string): "desayuno" | "comida" | "cena" => {
        const hour = parseInt((time || "12:00").split(":")[0]);
        if (hour >= 6 && hour < 12) return "desayuno";
        if (hour >= 12 && hour < 18) return "comida";
        return "cena";
      };

      const newReservation = {
        guestName: `${reservationData.firstName || ""} ${reservationData.lastName || ""}`.trim() || reservationData.customerName || "",
        roomNumber: reservationData.roomNumber || "N/A",
        numberOfPeople: parseInt(reservationData.people || "1"),
        restaurant: reservationData.restaurant,
        date: new Date().toISOString().split("T")[0],
        time: reservationData.selectedTime || "12:00",
        mealBlock: getMealBlock(reservationData.selectedTime || "12:00"),
        status: "confirmada" as const,
        arrivalConfirmed: false,
        mealCompleted: false,
        specialRequests: reservationData.specialRequests || "",
        allergies: reservationData.allergies || "",
        email: reservationData.email || "",
      };
      console.log("[Completado] Agregando reserva:", newReservation);
      addReservation(newReservation);

      if (reservationData.email && isValidEmail(reservationData.email)) {
        const emailData = {
          customerName: `${reservationData.firstName || ""} ${reservationData.lastName || ""}`.trim() || reservationData.customerName || "Cliente",
          customerEmail: reservationData.email,
          restaurant: reservationData.restaurant || "Restaurante",
          date: new Date().toLocaleDateString("es-ES"),
          time: reservationData.selectedTime || "12:00",
          numberOfPeople: reservationData.people || "1",
          roomNumber: reservationData.roomNumber || "N/A",
          reservationNumber: newReservationNumber,
          specialRequests: reservationData.specialRequests || "Ninguna",
        };
        sendReservationConfirmationEmail(emailData)
          .then((success) => {
            if (success) {
              // ...
            }
          })
          .catch(() => {
            // ...
          });
      }
    } else if (!reservationData.restaurant || !reservationData.customerName) {
      console.warn("[Completado] Datos insuficientes para agregar reserva:", reservationData);
    }
  }, [reservationData, addReservation]);

  const handleGoHome = () => {
    resetReservationData();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ¡Reserva Confirmada!
        </h2>
        <p className="text-gray-600 mb-6">
          Su reserva en <strong>{reservationData.restaurant}</strong> ha sido
          confirmada exitosamente.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Número de confirmación: {reservationNumber || "Generando..."}
        </p>
        {/* DEBUG VISUAL: Mostrar la última reserva enviada */}
        <pre style={{ color: 'black', background: '#eee', padding: 8, marginBottom: 16 }}>
          {JSON.stringify({ reservationData, reservationNumber }, null, 2)}
        </pre>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="bg-slate-700 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
