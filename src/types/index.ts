export interface LinkedInProfile {
  name: string
  headline: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  location: string
  email?: string
  phone?: string
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  skills: string[]
}

export interface Education {
  degree: string
  school: string
  location: string
  startDate: string
  endDate: string
  description?: string
}

export interface JobDescription {
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  keywords: string[]
  skills: string[]
}

export interface CVData {
  profile: LinkedInProfile
  jobDescription: JobDescription
  optimizedContent: {
    summary: string
    experience: Experience[]
    skills: string[]
    keywords: string[]
  }
  atsScore: number
  template: string
}

export interface ProcessingStep {
  id: string
  title: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  description: string
}