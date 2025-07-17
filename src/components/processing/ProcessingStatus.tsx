import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Zap, Target, FileText, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface ProcessingStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'processing' | 'completed'
  duration?: number
}

interface ProcessingStatusProps {
  isProcessing: boolean
  onComplete?: () => void
}

export function ProcessingStatus({ isProcessing, onComplete }: ProcessingStatusProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  
  const steps: ProcessingStep[] = [
    {
      id: 'linkedin',
      title: 'Analyzing LinkedIn Profile',
      description: 'Extracting your experience, skills, and achievements',
      status: 'pending'
    },
    {
      id: 'job',
      title: 'Processing Job Description',
      description: 'Identifying key requirements and keywords',
      status: 'pending'
    },
    {
      id: 'matching',
      title: 'AI Content Optimization',
      description: 'Tailoring your experience to match job requirements',
      status: 'pending'
    },
    {
      id: 'ats',
      title: 'ATS Optimization',
      description: 'Ensuring your CV passes applicant tracking systems',
      status: 'pending'
    },
    {
      id: 'generation',
      title: 'Generating CV',
      description: 'Creating your tailored, professional CV',
      status: 'pending'
    }
  ]

  const [processedSteps, setProcessedSteps] = useState(steps)

  useEffect(() => {
    if (!isProcessing) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1
        if (nextStep >= steps.length) {
          clearInterval(interval)
          setProgress(100)
          setTimeout(() => onComplete?.(), 1000)
          return prev
        }
        
        setProgress((nextStep / steps.length) * 100)
        
        setProcessedSteps(current => 
          current.map((step, index) => ({
            ...step,
            status: index < nextStep ? 'completed' : index === nextStep ? 'processing' : 'pending'
          }))
        )
        
        return nextStep
      })
    }, 2000) // 2 seconds per step

    return () => clearInterval(interval)
  }, [isProcessing, onComplete, steps.length])

  if (!isProcessing) return null

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
          <Zap className="w-8 h-8 text-purple-600" />
        </div>
        <CardTitle className="text-2xl">AI is Crafting Your Perfect CV</CardTitle>
        <CardDescription className="text-base">
          Our AI is analyzing your profile and optimizing your CV for this specific role
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          {processedSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 ${
                step.status === 'completed' 
                  ? 'bg-green-50 border border-green-200' 
                  : step.status === 'processing'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {step.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {step.status === 'processing' && (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
                {step.status === 'pending' && (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${
                    step.status === 'completed' 
                      ? 'text-green-900' 
                      : step.status === 'processing'
                      ? 'text-blue-900'
                      : 'text-gray-700'
                  }`}>
                    {step.title}
                  </h3>
                  <Badge 
                    variant={
                      step.status === 'completed' 
                        ? 'default' 
                        : step.status === 'processing'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="ml-2"
                  >
                    {step.status === 'completed' && 'Done'}
                    {step.status === 'processing' && 'Processing...'}
                    {step.status === 'pending' && 'Waiting'}
                  </Badge>
                </div>
                <p className={`text-sm mt-1 ${
                  step.status === 'completed' 
                    ? 'text-green-700' 
                    : step.status === 'processing'
                    ? 'text-blue-700'
                    : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">What makes our AI special?</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Maintains 100% truthfulness - no false claims</li>
                <li>• Optimizes for ATS systems and human reviewers</li>
                <li>• Matches keywords while preserving your authentic voice</li>
                <li>• Highlights relevant experience for this specific role</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}