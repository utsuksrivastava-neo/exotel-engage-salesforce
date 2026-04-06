import { Check } from 'lucide-react';

interface Step {
  label: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                  isCompleted
                    ? 'bg-primary-600 text-white'
                    : isCurrent
                    ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                    : 'bg-surface-100 text-surface-400 border border-surface-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <div className="min-w-0">
                <p className={`text-[12px] font-semibold ${isCurrent ? 'text-primary-700' : isCompleted ? 'text-surface-700' : 'text-surface-400'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-surface-400 hidden lg:block">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${index < currentStep ? 'bg-primary-600' : 'bg-surface-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
