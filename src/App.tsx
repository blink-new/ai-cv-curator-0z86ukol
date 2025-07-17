import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Header } from './components/layout/Header'
import { StepIndicator } from './components/steps/StepIndicator'
import { LinkedInInput } from './components/forms/LinkedInInput'
import { JobDescriptionInput } from './components/forms/JobDescriptionInput'
import { ProcessingStatus } from './components/processing/ProcessingStatus'
import { CVPreview } from './components/preview/CVPreview'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'
import { generateMockCVData } from './utils/mockCVData'
import { CVData } from './types'

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
  const [cvData, setCvData] = useState<CVData | null>(null)
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
    
    // Generate mock CV data
    const generatedCVData = generateMockCVData(linkedinUrl, jobData)
    setCvData(generatedCVData)
    
    setCurrentStep('preview')
    updateStepStatus('preview', 'completed')
    
    toast({
      title: "CV Generated Successfully!",
      description: "Your tailored CV is ready for preview and download",
    })
  }

  const getCurrentStepIndex = () => {
    const stepMap = { linkedin: 0, job: 1, processing: 2, preview: 3 }
    return stepMap[currentStep]
  }

  const handleDownload = async (format: 'pdf' | 'docx') => {
    try {
      toast({
        title: "Generating Download...",
        description: `Creating your CV in ${format.toUpperCase()} format`,
      })
      
      // Simulate download generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, this would call an API to generate the file
      const filename = `${cvData?.profile.name.replace(/\s+/g, '_')}_CV.${format}`
      
      toast({
        title: "Download Ready!",
        description: `Your CV has been generated as ${filename}`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your CV. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTemplateChange = (template: string) => {
    if (cvData) {
      setCvData({ ...cvData, template })
      toast({
        title: "Template Updated",
        description: `Switched to ${template} template`,
      })
    }
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

          {currentStep === 'preview' && cvData && (
            <CVPreview 
              cvData={cvData}
              onDownload={handleDownload}
              onTemplateChange={handleTemplateChange}
            />
          )}
        </div>
      </main>

      <Toaster />
    </div>
  )
}

export default App