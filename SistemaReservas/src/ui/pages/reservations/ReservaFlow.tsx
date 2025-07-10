import { useState } from "react";
import SelectRestaurantStep from "./Encontrar";
import SelectDateTimeStep from "./Horarios";
import InformacionPage from "./Informacion";
// Importa los demás pasos cuando existan

export default function ReservaFlow() {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((s) => s + 1);

  return (
    <div>
      {step === 1 && <SelectRestaurantStep onNext={goNext} />}
      {step === 2 && <SelectDateTimeStep onNext={goNext} />}
      {step === 3 && <InformacionPage onNext={goNext} onBack={() => setStep(2)} />}
      {/*
      {step === 4 && <AdicionalPage onNext={goNext} onBack={goBack} />}
      {step === 5 && <ConfirmacionPage onBack={goBack} />}
      */}
    </div>
  );
}
