import { CVData, LinkedInProfile, JobDescription } from '@/types'

export function generateMockCVData(linkedinUrl: string, jobData: any): CVData {
  // Mock LinkedIn profile data
  const mockProfile: LinkedInProfile = {
    name: "Sarah Johnson",
    headline: "Senior Software Engineer | Full-Stack Developer",
    summary: "Experienced software engineer with 5+ years developing scalable web applications using modern technologies. Passionate about creating efficient, user-friendly solutions and leading development teams.",
    location: "San Francisco, CA",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        startDate: "Jan 2022",
        endDate: "Present",
        description: "Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and conducted code reviews.",
        skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Kubernetes"]
      },
      {
        title: "Full-Stack Developer",
        company: "StartupXYZ",
        location: "San Francisco, CA",
        startDate: "Jun 2020",
        endDate: "Dec 2021",
        description: "Built responsive web applications using React and Express.js. Collaborated with design team to implement pixel-perfect UIs. Optimized database queries improving performance by 40%.",
        skills: ["React", "Express.js", "MongoDB", "JavaScript", "CSS", "Git"]
      },
      {
        title: "Junior Developer",
        company: "WebSolutions LLC",
        location: "San Jose, CA",
        startDate: "Aug 2019",
        endDate: "May 2020",
        description: "Developed and maintained client websites using HTML, CSS, and JavaScript. Participated in agile development process and daily standups.",
        skills: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "MySQL"]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        location: "Berkeley, CA",
        startDate: "Aug 2015",
        endDate: "May 2019",
        description: "Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems."
      }
    ],
    skills: [
      "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", 
      "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "Git", "Agile"
    ]
  }

  // Mock job description based on input
  const mockJobDescription: JobDescription = {
    title: "Senior Frontend Developer",
    company: "InnovateTech Solutions",
    location: "San Francisco, CA",
    description: "We are seeking a Senior Frontend Developer to join our dynamic team and help build the next generation of web applications.",
    requirements: [
      "5+ years of experience in frontend development",
      "Expert knowledge of React and TypeScript",
      "Experience with modern build tools and CI/CD",
      "Strong understanding of responsive design",
      "Experience with testing frameworks",
      "Excellent communication and teamwork skills"
    ],
    keywords: [
      "React", "TypeScript", "Frontend", "JavaScript", "CSS", "HTML",
      "Responsive Design", "Testing", "CI/CD", "Agile", "Git", "Performance"
    ],
    skills: [
      "React", "TypeScript", "JavaScript", "CSS", "HTML", "Jest", 
      "Cypress", "Webpack", "Git", "Agile", "Responsive Design"
    ]
  }

  // Generate optimized content
  const optimizedSummary = "Senior Software Engineer with 5+ years of experience specializing in frontend development and React applications. Proven track record of building scalable, responsive web applications using TypeScript and modern development practices. Expert in implementing CI/CD pipelines and agile methodologies, with strong leadership and mentoring capabilities."

  const optimizedExperience = mockProfile.experience.map(exp => ({
    ...exp,
    description: exp.description + " Utilized React and TypeScript to deliver high-quality, responsive user interfaces with comprehensive testing coverage."
  }))

  const optimizedSkills = [
    ...mockJobDescription.skills,
    ...mockProfile.skills.filter(skill => !mockJobDescription.skills.includes(skill))
  ].slice(0, 15)

  const matchedKeywords = mockJobDescription.keywords.filter(keyword => 
    optimizedSummary.toLowerCase().includes(keyword.toLowerCase()) ||
    optimizedExperience.some(exp => 
      exp.description.toLowerCase().includes(keyword.toLowerCase()) ||
      exp.skills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))
    )
  )

  // Calculate ATS score
  const keywordScore = (matchedKeywords.length / mockJobDescription.keywords.length) * 40
  const skillScore = (optimizedSkills.filter(skill => mockJobDescription.skills.includes(skill)).length / mockJobDescription.skills.length) * 30
  const formatScore = 30 // Perfect format score
  const atsScore = Math.round(keywordScore + skillScore + formatScore)

  return {
    profile: mockProfile,
    jobDescription: mockJobDescription,
    optimizedContent: {
      summary: optimizedSummary,
      experience: optimizedExperience,
      skills: optimizedSkills,
      keywords: matchedKeywords
    },
    atsScore,
    template: 'modern'
  }
}