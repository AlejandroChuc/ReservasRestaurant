import { useState } from "react";
// ...existing code...
import EncontrarPage from "./ui/pages/reservations/Encontrar";
import HorariosPage from "./ui/pages/reservations/Horarios";
import InformacionPage from "./ui/pages/reservations/Informacion";
import AdicionalPage from "./ui/pages/reservations/Adicional";
import ConfirmacionPage from "./ui/pages/reservations/Confirmacion";
import CompletadoPage from "./ui/pages/reservations/Completado";
import ColaboradorApp from "./ui/pages/Colaborador/index";
import ReservaFlow from "./ui/pages/reservations/ReservaFlow";

function HomeScreen({
  onBook,
  onColaborador,
  onNuevaReserva,
}: {
  onBook: () => void;
  onColaborador: () => void;
  onNuevaReserva: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#2C3E50]">
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Logo */}
        <div className="mt-16 mb-10">
          <div className="border-4 border-white p-8 rounded-md">
            <span className="text-white text-5xl font-light tracking-widest block text-center">
              RCD
            </span>
            <span className="text-white text-lg font-light block text-center mt-2 tracking-widest">
              HOTELS
            </span>
          </div>
        </div>
        {/* Botones */}
        <div className="flex flex-col gap-4">
          <button
            onClick={onBook}
            className="bg-[#C4912E] hover:bg-[#b07e1d] text-black font-semibold text-xl px-12 py-4 rounded-lg border-2 border-black shadow transition"
          >
            Book Now (Original)
          </button>
          <button
            onClick={onNuevaReserva}
            className="bg-[#27AE60] hover:bg-[#229954] text-white font-semibold text-xl px-12 py-4 rounded-lg border-2 border-white shadow transition"
          >
            🏨 Nueva Reserva con Validación
          </button>
          <button
            onClick={onColaborador}
            className="bg-[#4A5A6C] hover:bg-[#3A4A5C] text-white font-semibold text-lg px-12 py-3 rounded-lg border-2 border-white shadow transition"
          >
            Sistema Colaborador
          </button>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-black text-white flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <div className="bg-black p-2">
            <span className="text-xs font-light">RCD</span>
          </div>
          <div className="bg-[#22313A] px-4 py-1 ml-2 rounded">
            <span className="text-[#8ec6e6] text-xs font-semibold tracking-widest">
              CORPORACIÓN INMOBILIARIA KTRC, S.A. DE C.V.
            </span>
          </div>
        </div>
        <div className="text-right text-xs leading-tight">
          Blvd. Kukulcan Km 14, Zona Hotelera
          <br />
          Cancun, Quintana Roo 77500
          <br />
          Mexico
          <br />
          Reservations: 800-681-9205
        </div>
      </footer>
    </div>
  );
}
const COLAB_KEY = "rcd-reservas-colab";

export default function App() {
  const [step, setStep] = useState<
    | "home"
    | "encontrar"
    | "horarios"
    | "informacion"
    | "adicional"
    | "confirmacion"
    | "completado"
    | "colaborador"
    | "nueva-reserva"
  >(() => {
    if (typeof window !== 'undefined') {
      const isColab = localStorage.getItem(COLAB_KEY);
      return isColab === 'true' ? "colaborador" : "home";
    }
    return "home";
  });

  // Actualizar localStorage solo cuando se entra o sale del modo colaborador
  const setStepWithColab = (newStep: typeof step) => {
    setStep(newStep);
    if (typeof window !== 'undefined') {
      if (newStep === 'colaborador') {
        localStorage.setItem(COLAB_KEY, 'true');
      } else if (newStep === 'home') {
        localStorage.removeItem(COLAB_KEY);
      }
    }
  };

  return (
    <>
      {step === "home" && (
        <HomeScreen
          onBook={() => setStepWithColab("encontrar")}
          onColaborador={() => setStepWithColab("colaborador")}
          onNuevaReserva={() => setStepWithColab("nueva-reserva")}
        />
      )}
      {step === "nueva-reserva" && (
        <ReservaFlow onExit={() => setStepWithColab("home")} />
      )}
      {step === "colaborador" && (
        <ColaboradorApp onExit={() => setStepWithColab("home")} />
      )}
      {step === "encontrar" && (
        <EncontrarPage onNext={() => setStepWithColab("informacion")} />
      )}
      {step === "informacion" && (
        <InformacionPage
          onNext={() => setStepWithColab("horarios")}
          onBack={() => setStepWithColab("encontrar")}
        />
      )}
      {step === "horarios" && (
        <HorariosPage
          onNext={() => setStepWithColab("adicional")}
          onBack={() => setStepWithColab("informacion")}
        />
      )}
      {step === "adicional" && (
        <AdicionalPage
          onNext={() => setStepWithColab("confirmacion")}
          onBack={() => setStepWithColab("horarios")}
        />
      )}
      {step === "confirmacion" && (
        <ConfirmacionPage
          onNext={() => setStepWithColab("completado")}
          onBack={() => setStepWithColab("adicional")}
        />
      )}
      {step === "completado" && (
        <CompletadoPage onComplete={() => setStepWithColab("home")} />
      )}
    </>
  );
}
