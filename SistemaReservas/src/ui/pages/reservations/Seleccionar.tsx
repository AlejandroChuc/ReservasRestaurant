import { useEffect, useState } from "react";
import { useReservation } from "../../../context/ReservationContext";
import ReservationLayout from "../../components/Layout/ReservationLayout";

export default function SeleccionarPage({ onNext }: { onNext: () => void }) {
  const { reservationData, updateReservationData, setCurrentStep } = useReservation();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(reservationData.restaurantId || null);

  useEffect(() => {
    setCurrentStep(1);
    fetch("/api/getRestaurants")
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
        setLoading(false);
      });
  }, [setCurrentStep]);

  const handleSelect = (id: number, nombre: string) => {
    setSelectedId(id);
    updateReservationData({ restaurantId: id, restaurant: nombre });
  };

  const handleContinue = () => {
    if (selectedId) onNext();
  };

  return (
    <ReservationLayout
      currentStep={1}
      title="Selecciona un Restaurante"
      subtitle="Elige el restaurante para tu reserva"
    >
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {loading ? (
          <div className="text-white text-center">Cargando restaurantes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurants.map((rest) => (
              <button
                key={rest.id_restaurante}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${selectedId === rest.id_restaurante ? "border-amber-500 bg-white/10" : "border-white/20 bg-white/5"}`}
                onClick={() => handleSelect(rest.id_restaurante, rest.nombre)}
              >
                <div className="text-xl font-bold text-white mb-2">{rest.nombre}</div>
                <div className="text-slate-300 text-sm">{rest.descripcion}</div>
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-end pt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedId}
            className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 ${selectedId ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
          >
            Continuar
          </button>
        </div>
      </div>
    </ReservationLayout>
  );
}
