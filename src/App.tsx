import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Header } from './components/layout/Header'
import { StepIndicator } from './components/steps/StepIndicator'
import { LinkedInInput } from './components/forms/LinkedInInput'
import { JobDescriptionInput } from './components/forms/JobDescriptionInput'
import { ProcessingStatus } from './components/processing/ProcessingStatus'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'

type AppStep = 'linkedin' | 'job' | 'processing' | 'preview'

interface ProcessingStep {
  id: string
  title: string
  status: 'pending' | 'processing' | 'completed' | 'error'
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<AppStep>('linkedin')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [jobData, setJobData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const steps: ProcessingStep[] = [
    { id: 'linkedin', title: 'LinkedIn Profile', status: 'pending' },
    { id: 'job', title: 'Job Description', status: 'pending' },
    { id: 'processing', title: 'AI Processing', status: 'pending' },
    { id: 'preview', title: 'Preview & Download', status: 'pending' }
  ]

  const [processSteps, setProcessSteps] = useState(steps)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const updateStepStatus = (stepId: string, status: ProcessingStep['status']) => {
    setProcessSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    )
  }

  const handleLinkedInSubmit = async (url: string) => {
    try {
      setLinkedinUrl(url)
      updateStepStatus('linkedin', 'completed')
      setCurrentStep('job')
      
      toast({
        title: "LinkedIn Profile Connected",
        description: "Successfully connected your LinkedIn profile",
      })
    } catch (error) {
      updateStepStatus('linkedin', 'error')
      toast({
        title: "Error",
        description: "Failed to connect LinkedIn profile",
        variant: "destructive",
      })
    }
  }

  const handleJobSubmit = async (data: { type: 'url' | 'text' | 'file', content: string | File }) => {
    try {
      setJobData(data)
      updateStepStatus('job', 'completed')
      setCurrentStep('processing')
      setIsProcessing(true)
      
      toast({
        title: "Job Description Added",
        description: "Successfully processed job description",
      })
    } catch (error) {
      updateStepStatus('job', 'error')
      toast({
        title: "Error",
        description: "Failed to process job description",
        variant: "destructive",
      })
    }
  }

  const handleProcessingComplete = () => {
    setIsProcessing(false)
    updateStepStatus('processing', 'completed')
    setCurrentStep('preview')
    
    toast({
      title: "CV Generated Successfully!",
      description: "Your tailored CV is ready for preview and download",
    })
  }

  const getCurrentStepIndex = () => {
    const stepMap = { linkedin: 0, job: 1, processing: 2, preview: 3 }
    return stepMap[currentStep]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CV Curator</h1>
          <p className="text-gray-600 mb-6">Please sign in to create your AI-powered, ATS-optimized CV</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <StepIndicator steps={processSteps} currentStep={getCurrentStepIndex()} />
        </div>

        <div className="space-y-8">
          {currentStep === 'linkedin' && (
            <LinkedInInput 
              onSubmit={handleLinkedInSubmit}
              isLoading={false}
            />
          )}

          {currentStep === 'job' && (
            <JobDescriptionInput 
              onSubmit={handleJobSubmit}
              isLoading={false}
            />
          )}

          {currentStep === 'processing' && (
            <ProcessingStatus 
              isProcessing={isProcessing}
              onComplete={handleProcessingComplete}
            />
          )}

          {currentStep === 'preview' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">CV Generated Successfully!</h2>
              <p className="text-gray-600 mb-8">Your tailored, ATS-optimized CV is ready</p>
              
              <div className="bg-white rounded-lg shadow-sm border p-8 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">Preview & Download will be available soon</h3>
                <p className="text-gray-600">
                  The CV preview and download functionality is coming in the next update. 
                  Your LinkedIn profile ({linkedinUrl}) and job description have been successfully processed.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Toaster />
    </div>
  )
}

export default App