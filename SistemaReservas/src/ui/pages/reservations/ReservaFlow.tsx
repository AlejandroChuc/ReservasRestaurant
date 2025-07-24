import { useState } from "react";
import SelectRestaurantStep from "./Encontrar";
import SelectDateTimeStep from "./Horarios";
import InformacionPage from "./Informacion";
// Importa los demás pasos cuando existan

interface ReservaFlowProps {
  onExit: () => void;
}

export default function ReservaFlow({ onExit }: ReservaFlowProps) {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((s) => s + 1);

  return (
    <div>
      {step === 1 && <SelectRestaurantStep onNext={goNext} />}
      {step === 2 && <SelectDateTimeStep onNext={goNext} />}
      {step === 3 && <InformacionPage onNext={goNext} onBack={() => setStep(2)} />}
      {/*
      
      */}
    </div>
  );
}
