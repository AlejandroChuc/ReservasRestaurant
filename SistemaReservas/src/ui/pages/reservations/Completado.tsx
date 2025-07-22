import { useReservation } from "../../../context/ReservationContext";
import { useGlobalReservations } from "../../../context/GlobalReservationsContext";
import { useEffect, useState, useRef } from "react";
import { sendReservationConfirmationEmail, isValidEmail } from "../../../services/emailService";

interface CompletadoPageProps {
  onComplete: () => void;
}

export default function CompletadoPage({ onComplete }: CompletadoPageProps) {
  const { reservationData, resetReservationData } = useReservation();
  // const { addReservation } = useGlobalReservations();
  useEffect(() => {
    // Solo guardar una vez por render
    if (hasAddedReservation.current) return;
    hasAddedReservation.current = true;

    // Aquí debes mapear reservationData a los campos que espera la API
    // Debes tener los IDs de huésped y horario ya generados
    // Si no los tienes, deberías crearlos antes de la reserva
    // Aquí se asume que reservationData.restaurantId y reservationData.horarioId existen
    const payload = {
      id_huesped: reservationData.id_huesped || 1, // Ajusta según tu flujo real
      id_horario: reservationData.id_horario, // Usa el id_horario real seleccionado
      fecha_reserva: reservationData.selectedDate || new Date().toISOString().slice(0, 10),
      num_personas: reservationData.people || 2,
      alergias: reservationData.allergies || '',
      estado: 'Pendiente',
      confirmacion: false
    };

    fetch('/api/createReservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          console.error('Error al guardar reserva:', data.error || data);
        }
      })
      .catch(err => {
        console.error('Error al guardar reserva:', err);
      });
  }, [reservationData]);
  const [reservationNumber, setReservationNumber] = useState("");
  const hasAddedReservation = useRef(false);


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
        <p className="text-green-700 font-semibold mb-2">
          Se envió correo con éxito a <span className="font-mono">{reservationData.email}</span>
        </p>
        <p className="text-gray-600 mb-6">
          Su reserva en <strong>{reservationData.restaurant}</strong> ha sido confirmada exitosamente.
        </p>
        
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
