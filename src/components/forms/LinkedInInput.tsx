import { useState } from 'react'
import { Linkedin, ExternalLink, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface LinkedInInputProps {
  onSubmit: (url: string) => void
  isLoading?: boolean
}

export function LinkedInInput({ onSubmit, isLoading }: LinkedInInputProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const validateLinkedInUrl = (url: string) => {
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
    return linkedinRegex.test(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter your LinkedIn profile URL')
      return
    }

    if (!validateLinkedInUrl(url)) {
      setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)')
      return
    }

    onSubmit(url)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
          <Linkedin className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Connect Your LinkedIn Profile</CardTitle>
        <CardDescription className="text-base">
          We'll analyze your profile to extract your experience, skills, and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="linkedin-url" className="text-sm font-medium">
              LinkedIn Profile URL
            </Label>
            <div className="relative">
              <Input
                id="linkedin-url"
                type="url"
                placeholder="https://linkedin.com/in/yourname"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
              <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to find your LinkedIn URL:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Go to your LinkedIn profile</li>
              <li>2. Click "Contact info" or copy the URL from your browser</li>
              <li>3. Make sure your profile is set to public</li>
            </ol>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-blue-600 mt-2"
              onClick={() => window.open('https://linkedin.com', '_blank')}
            >
              Open LinkedIn <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? 'Analyzing Profile...' : 'Analyze LinkedIn Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}