import { useState } from 'react'
import { Download, Eye, FileText, Star, Target, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CVData } from '@/types'

interface CVPreviewProps {
  cvData: CVData
  onDownload: (format: 'pdf' | 'docx') => void
  onTemplateChange: (template: string) => void
}

export function CVPreview({ cvData, onDownload, onTemplateChange }: CVPreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(cvData.template || 'modern')
  const [isDownloading, setIsDownloading] = useState(false)

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, contemporary design perfect for tech and creative roles',
      preview: '/templates/modern-preview.jpg'
    },
    {
      id: 'classic',
      name: 'Classic Executive',
      description: 'Traditional format ideal for corporate and executive positions',
      preview: '/templates/classic-preview.jpg'
    },
    {
      id: 'creative',
      name: 'Creative Portfolio',
      description: 'Stylish design for creative professionals and designers',
      preview: '/templates/creative-preview.jpg'
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple, focused layout that highlights your content',
      preview: '/templates/minimal-preview.jpg'
    }
  ]

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    onTemplateChange(templateId)
  }

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setIsDownloading(true)
    try {
      await onDownload(format)
    } finally {
      setIsDownloading(false)
    }
  }

  const getATSScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getATSScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with ATS Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Your Tailored CV is Ready!</CardTitle>
              <CardDescription>
                Optimized for the {cvData.jobDescription.title} position at {cvData.jobDescription.company}
              </CardDescription>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getATSScoreColor(cvData.atsScore)}`}>
                {cvData.atsScore}%
              </div>
              <div className="text-sm text-gray-600">ATS Score</div>
              <Badge variant={cvData.atsScore >= 80 ? 'default' : cvData.atsScore >= 60 ? 'secondary' : 'destructive'}>
                {getATSScoreLabel(cvData.atsScore)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Templates and Controls */}
        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Choose Template
              </CardTitle>
              <CardDescription>
                Select a template that matches your industry and style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{template.name}</h4>
                    {selectedTemplate === template.id && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ATS Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                ATS Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall ATS Score</span>
                  <span className={getATSScoreColor(cvData.atsScore)}>
                    {cvData.atsScore}%
                  </span>
                </div>
                <Progress value={cvData.atsScore} className="h-2" />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Keywords Matched</span>
                  <Badge variant="outline">
                    {cvData.optimizedContent.keywords.length} / {cvData.jobDescription.keywords.length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Skills Alignment</span>
                  <Badge variant="outline">
                    {Math.round((cvData.optimizedContent.skills.filter(skill => 
                      cvData.jobDescription.skills.includes(skill)
                    ).length / cvData.jobDescription.skills.length) * 100)}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Format Compliance</span>
                  <Badge variant="default">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Excellent
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download CV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleDownload('pdf')}
                disabled={isDownloading}
                className="w-full"
                size="lg"
              >
                {isDownloading ? 'Generating...' : 'Download PDF'}
              </Button>
              
              <Button
                onClick={() => handleDownload('docx')}
                disabled={isDownloading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {isDownloading ? 'Generating...' : 'Download Word'}
              </Button>

              <div className="text-xs text-gray-500 text-center mt-2">
                PDF recommended for most applications
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - CV Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  CV Preview
                </CardTitle>
                <Badge variant="outline">{templates.find(t => t.id === selectedTemplate)?.name}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Visual Preview</TabsTrigger>
                  <TabsTrigger value="content">Content Review</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="mt-6">
                  <div className="bg-white border rounded-lg p-8 shadow-sm min-h-[800px]">
                    {/* CV Preview Content */}
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="text-center border-b pb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {cvData.profile.name}
                        </h1>
                        <p className="text-lg text-gray-600 mb-4">
                          {cvData.optimizedContent.summary}
                        </p>
                        <div className="flex justify-center space-x-4 text-sm text-gray-500">
                          <span>{cvData.profile.location}</span>
                          {cvData.profile.email && <span>•</span>}
                          {cvData.profile.email && <span>{cvData.profile.email}</span>}
                          {cvData.profile.phone && <span>•</span>}
                          {cvData.profile.phone && <span>{cvData.profile.phone}</span>}
                        </div>
                      </div>

                      {/* Experience */}
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                          Professional Experience
                        </h2>
                        <div className="space-y-6">
                          {cvData.optimizedContent.experience.map((exp, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                                  <p className="text-gray-600">{exp.company} • {exp.location}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {exp.startDate} - {exp.endDate}
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {exp.description}
                              </p>
                              {exp.skills.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {exp.skills.map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                          Key Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {cvData.optimizedContent.skills.map((skill, index) => (
                            <Badge 
                              key={index} 
                              variant={cvData.jobDescription.skills.includes(skill) ? "default" : "outline"}
                              className="text-sm"
                            >
                              {skill}
                              {cvData.jobDescription.skills.includes(skill) && (
                                <Star className="w-3 h-3 ml-1" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      {cvData.profile.education.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                            Education
                          </h2>
                          <div className="space-y-4">
                            {cvData.profile.education.map((edu, index) => (
                              <div key={index}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                    <p className="text-gray-600">{edu.school} • {edu.location}</p>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {edu.startDate} - {edu.endDate}
                                  </div>
                                </div>
                                {edu.description && (
                                  <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="mt-6">
                  <div className="space-y-6">
                    {/* Optimized Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Professional Summary</CardTitle>
                        <CardDescription>AI-optimized for this role</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">
                          {cvData.optimizedContent.summary}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Keywords Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Keyword Optimization</CardTitle>
                        <CardDescription>
                          Keywords from job description integrated into your CV
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Matched Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                              {cvData.optimizedContent.keywords.map((keyword, index) => (
                                <Badge key={index} variant="default" className="text-sm">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Job Requirements Coverage</h4>
                            <div className="space-y-2">
                              {cvData.jobDescription.requirements.slice(0, 5).map((req, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-gray-700">{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}