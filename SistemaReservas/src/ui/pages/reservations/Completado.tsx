import { useReservation } from "../../../context/ReservationContext"

interface CompletadoPageProps {
  onNewReservation: () => void;
  onComplete: () => void;
}

export default function CompletadoPage({ onNewReservation, onComplete }: CompletadoPageProps) {
  const { reservationData } = useReservation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Reserva Confirmada!</h2>
        <p className="text-gray-600 mb-6">
          Su reserva en <strong>{reservationData.restaurant}</strong> ha sido confirmada exitosamente. Recibirá un email
          de confirmación en <strong>{reservationData.email}</strong> en breve.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Número de confirmación:{" "}
          <span className="font-mono font-bold">RES-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNewReservation}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300"
          >
            Hacer Nueva Reserva
          </button>
          <button
            onClick={onComplete}
            className="bg-slate-700 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}