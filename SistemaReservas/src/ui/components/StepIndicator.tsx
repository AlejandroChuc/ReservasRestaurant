interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Encontrar" },
    { number: 2, label: "Información" },
    { number: 3, label: "Adicional" },
    { number: 4, label: "Confirmación" },
  ]

  return (
    <div className="flex justify-between w-full max-w-2xl mb-16">
      {steps.map((step, index) => {
        const isActive = currentStep >= step.number
        const isCurrent = currentStep === step.number

        return (
          <div key={step.number} className="flex flex-col items-center relative">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-6 left-12 w-full h-0.5 bg-slate-600 z-0">
                <div
                  className={`h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 ${
                    currentStep > step.number ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )}

            {/* Step Circle */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg shadow-lg transition-all duration-300 relative z-10 ${
                isActive
                  ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
                  : "border-2 border-slate-600 text-slate-400"
              } ${isCurrent ? "scale-110 shadow-amber-500/25" : ""}`}
            >
              {isActive && currentStep > step.number ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </div>

            {/* Step Label */}
            <span
              className={`text-sm mt-3 font-medium transition-colors duration-300 ${
                isActive ? "text-amber-400" : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}