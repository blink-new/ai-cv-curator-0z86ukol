import { useState } from 'react'
import { Upload, Link, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface JobDescriptionInputProps {
  onSubmit: (data: { type: 'url' | 'text' | 'file', content: string | File }) => void
  isLoading?: boolean
}

export function JobDescriptionInput({ onSubmit, isLoading }: JobDescriptionInputProps) {
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('url')

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter a job posting URL')
      return
    }

    try {
      new URL(url)
      onSubmit({ type: 'url', content: url })
    } catch {
      setError('Please enter a valid URL')
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!text.trim()) {
      setError('Please enter the job description')
      return
    }

    if (text.length < 100) {
      setError('Job description seems too short. Please provide more details.')
      return
    }

    onSubmit({ type: 'text', content: text })
  }

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Please select a file')
      return
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, Word document, or text file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB')
      return
    }

    onSubmit({ type: 'file', content: file })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
          <FileText className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Add Job Description</CardTitle>
        <CardDescription className="text-base">
          Provide the job posting you want to tailor your CV for
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-url">Job Posting URL</Label>
                <Input
                  id="job-url"
                  type="url"
                  placeholder="https://company.com/careers/job-posting"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Analyze Job Posting'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-text">Job Description</Label>
                <Textarea
                  id="job-text"
                  placeholder="Paste the complete job description here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px]"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500">
                  {text.length} characters (minimum 100 recommended)
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Analyze Job Description'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <form onSubmit={handleFileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-file">Upload Job Description</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, Word, or Text files (max 10MB)
                    </p>
                  </div>
                  <Input
                    id="job-file"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => document.getElementById('job-file')?.click()}
                    disabled={isLoading}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !file}>
                {isLoading ? 'Processing...' : 'Analyze Job Description'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}