import { useState } from "react";
import { ReservationProvider } from "./context/ReservationContext";
import { GlobalReservationsProvider } from "./context/GlobalReservationsContext";
import EncontrarPage from "./ui/pages/reservations/Encontrar";
import InformacionPage from "./ui/pages/reservations/Informacion";
import AdicionalPage from "./ui/pages/reservations/Adicional";
import ConfirmacionPage from "./ui/pages/reservations/Confirmacion";
import CompletadoPage from "./ui/pages/reservations/Completado";
import ColaboradorApp from "./ui/pages/Colaborador/index";

function HomeScreen({
  onBook,
  onColaborador,
}: {
  onBook: () => void;
  onColaborador: () => void;
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
            Book Now
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

export default function App() {
  const [step, setStep] = useState<
    | "home"
    | "encontrar"
    | "informacion"
    | "adicional"
    | "confirmacion"
    | "completado"
    | "colaborador"
  >("home");

  return (
    <GlobalReservationsProvider>
      <ReservationProvider>
        {step === "home" && (
          <HomeScreen
            onBook={() => setStep("encontrar")}
            onColaborador={() => setStep("colaborador")}
          />
        )}{" "}
        {step === "colaborador" && (
          <ColaboradorApp onExit={() => setStep("home")} />
        )}
        {step === "encontrar" && (
          <EncontrarPage onNext={() => setStep("informacion")} />
        )}
        {step === "informacion" && (
          <InformacionPage
            onNext={() => setStep("adicional")}
            onBack={() => setStep("encontrar")}
          />
        )}
        {step === "adicional" && (
          <AdicionalPage
            onNext={() => setStep("confirmacion")}
            onBack={() => setStep("informacion")}
          />
        )}
        {step === "confirmacion" && (
          <ConfirmacionPage
            onNext={() => setStep("completado")}
            onBack={() => setStep("adicional")}
          />
        )}
        {step === "completado" && (
          <CompletadoPage
            onNewReservation={() => setStep("encontrar")}
            onComplete={() => setStep("home")}
          />
        )}
      </ReservationProvider>
    </GlobalReservationsProvider>
  );
}
