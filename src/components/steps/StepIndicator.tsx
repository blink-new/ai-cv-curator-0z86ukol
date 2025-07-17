import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: string
  title: string
  status: 'pending' | 'processing' | 'completed' | 'error'
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                  {
                    "bg-blue-600 border-blue-600 text-white": step.status === 'completed',
                    "bg-blue-100 border-blue-600 text-blue-600": step.status === 'processing',
                    "bg-gray-100 border-gray-300 text-gray-400": step.status === 'pending',
                    "bg-red-100 border-red-500 text-red-500": step.status === 'error'
                  }
                )}
              >
                {step.status === 'completed' && <Check className="w-5 h-5" />}
                {step.status === 'processing' && <Loader2 className="w-5 h-5 animate-spin" />}
                {step.status === 'pending' && <span className="text-sm font-medium">{index + 1}</span>}
                {step.status === 'error' && <span className="text-sm font-medium">!</span>}
              </div>
              <span
                className={cn(
                  "mt-2 text-sm font-medium transition-colors duration-300",
                  {
                    "text-blue-600": step.status === 'completed' || step.status === 'processing',
                    "text-gray-500": step.status === 'pending',
                    "text-red-500": step.status === 'error'
                  }
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors duration-300",
                  {
                    "bg-blue-600": index < currentStep,
                    "bg-gray-300": index >= currentStep
                  }
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}