"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/avatar"
import { Badge } from "@/components/common/badge"
import { Button } from "@/components/common/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/card"
import { Separator } from "@/components/common/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs"
import { ArrowLeft, Briefcase, Calendar, DollarSign, Github, GraduationCap, Linkedin, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Using the provided UserData interface
interface Skill {
  id: string
  name: string
}

interface UserData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  github_link?: string
  linkedin_link?: string
  public_profile_url?: string
  cv?: {
    fileName: string
    id: string
    name: string
  } | null
  role?: string
  adminNotes?: string
  profilePicture?: string
  years_of_experience?: number
  skills: Skill[]
  desired_position?: string
  salary_expectation?: string
  current_position?: string
  current_company?: string
  createdAt: Date
  updatedAt: Date
  birthday?: Date
  education?: {
    institution: string
    degree: string
    fieldOfStudy: string
    startDate: Date
    endDate?: Date
    description?: string
  }[]
}

// Define arrays at a higher scope so they're available throughout the component
const skills = [
  { id: "1", name: "React" },
  { id: "2", name: "TypeScript" },
  { id: "3", name: "CSS" },
  { id: "4", name: "Node.js" },
  { id: "5", name: "Python" },
  { id: "6", name: "MongoDB" },
  { id: "7", name: "PostgreSQL" },
  { id: "8", name: "AWS" },
  { id: "9", name: "Docker" },
  { id: "10", name: "Kubernetes" },
  { id: "11", name: "UI/UX" },
  { id: "12", name: "Figma" },
  { id: "13", name: "Java" },
  { id: "14", name: "C#" },
  { id: "15", name: "PHP" },
]

const companies = [
  "Tech Solutions Inc.",
  "Data Systems Corp",
  "Creative Designs LLC",
  "Cloud Innovations",
  "Web Experts Group",
  "Mobile App Masters",
  "Software Engineering Partners",
  "Digital Transformation Co.",
  "AI Research Labs",
  "Blockchain Ventures",
]

// This would normally come from an API, but we'll use the same sample data generator
const generateSampleContacts = (count: number): UserData[] => {
  // Use the skills array defined at the higher scope

  const positions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UX Designer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "QA Engineer",
    "Technical Lead",
    "Software Architect",
  ]

  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Emily",
    "David",
    "Sarah",
    "Robert",
    "Lisa",
    "William",
    "Jessica",
    "James",
    "Jennifer",
    "Daniel",
    "Amanda",
    "Matthew",
    "Elizabeth",
    "Christopher",
    "Melissa",
    "Andrew",
    "Stephanie",
  ]

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Hernandez",
    "Moore",
    "Martin",
    "Jackson",
    "Thompson",
    "White",
  ]

  const universities = [
    "Stanford University",
    "MIT",
    "Harvard University",
    "UC Berkeley",
    "University of Michigan",
    "Georgia Tech",
    "University of Washington",
    "Carnegie Mellon University",
    "University of Texas",
    "Cornell University",
  ]

  const degrees = [
    "Bachelor of Science",
    "Master of Science",
    "Bachelor of Arts",
    "Master of Arts",
    "PhD",
    "Associate Degree",
    "Bachelor of Engineering",
    "Master of Engineering",
    "Bachelor of Business Administration",
    "Master of Business Administration",
  ]

  const fields = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Data Science",
    "Electrical Engineering",
    "Business Informatics",
    "Artificial Intelligence",
    "Cybersecurity",
    "Web Development",
    "User Experience Design",
  ]

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const company = companies[Math.floor(Math.random() * companies.length)]
    const position = positions[Math.floor(Math.random() * positions.length)]
    const yearsOfExperience = Math.floor(Math.random() * 15) + 1

    // Randomly select 2-4 skills
    const userSkills = []
    const skillCount = Math.floor(Math.random() * 3) + 2
    const availableSkills = [...skills]

    for (let j = 0; j < skillCount; j++) {
      if (availableSkills.length === 0) break
      const randomIndex = Math.floor(Math.random() * availableSkills.length)
      userSkills.push(availableSkills[randomIndex])
      availableSkills.splice(randomIndex, 1)
    }

    // Generate 1-3 education entries
    const educationCount = Math.floor(Math.random() * 3) + 1
    const educationEntries = []

    for (let j = 0; j < educationCount; j++) {
      const startYear = 2000 + Math.floor(Math.random() * 15)
      const endYear = startYear + Math.floor(Math.random() * 6) + 1

      educationEntries.push({
        institution: universities[Math.floor(Math.random() * universities.length)],
        degree: degrees[Math.floor(Math.random() * degrees.length)],
        fieldOfStudy: fields[Math.floor(Math.random() * fields.length)],
        startDate: new Date(startYear, Math.floor(Math.random() * 12), 1),
        endDate: j === 0 ? new Date(endYear, Math.floor(Math.random() * 12), 1) : undefined,
        description:
          j === 0 ? "Graduated with honors. Participated in various research projects and hackathons." : undefined,
      })
    }

    // Sort education by start date (most recent first)
    educationEntries.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())

    // Generate birthday (25-45 years ago)
    const currentYear = new Date().getFullYear()
    const age = Math.floor(Math.random() * 20) + 25
    const birthYear = currentYear - age
    const birthMonth = Math.floor(Math.random() * 12)
    const birthDay = Math.floor(Math.random() * 28) + 1
    const birthday = new Date(birthYear, birthMonth, birthDay)

    // Generate salary expectation
    const baseSalary = 70000 + Math.floor(Math.random() * 130000)
    const salaryExpectation = `$${baseSalary.toLocaleString()} - $${(baseSalary + 30000).toLocaleString()}`

    return {
      id: (i + 1).toString(),
      first_name: firstName,
      last_name: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone_number: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      github_link: `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      linkedin_link: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      role: position,
      years_of_experience: yearsOfExperience,
      skills: userSkills,
      desired_position: `Senior ${position}`,
      salary_expectation: salaryExpectation,
      current_position: `${yearsOfExperience > 5 ? "Senior " : ""}${position}`,
      current_company: company,
      createdAt: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      updatedAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      profilePicture: `/placeholder.svg?height=300&width=300&text=${firstName[0]}${lastName[0]}`,
      birthday: birthday,
      education: educationEntries,
      adminNotes:
        Math.random() > 0.7 ? "Candidate shows strong potential. Follow up after technical assessment." : undefined,
    }
  })
}

const sampleContacts = generateSampleContacts(100)

export default function ContactProfile({ id }: { id: string }) {
  const router = useRouter()
  const [contact, setContact] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundContact = sampleContacts.find((c) => c.id === id)
    setContact(foundContact || null)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[50vh]">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Contacts
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Contact Not Found</CardTitle>
            <CardDescription>The contact you are looking for does not exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const formatDate = (date?: Date) => {
    if (!date) return "Present"
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date)
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Contacts
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarImage
                  src={contact.profilePicture || "/placeholder.svg"}
                  alt={`${contact.first_name} ${contact.last_name}`}
                />
                <AvatarFallback className="text-4xl">
                  {contact.first_name[0]}
                  {contact.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">
                {contact.first_name} {contact.last_name}
              </CardTitle>
              <CardDescription className="text-lg">{contact.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                      <a href={`mailto:${contact.email}`} className="hover:underline">
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone_number && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                        <a href={`tel:${contact.phone_number}`} className="hover:underline">
                          {contact.phone_number}
                        </a>
                      </div>
                    )}
                    {contact.github_link && (
                      <div className="flex items-center">
                        <Github className="h-5 w-5 mr-3 text-muted-foreground" />
                        <a
                          href={contact.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          GitHub Profile
                        </a>
                      </div>
                    )}
                    {contact.linkedin_link && (
                      <div className="flex items-center">
                        <Linkedin className="h-5 w-5 mr-3 text-muted-foreground" />
                        <a
                          href={contact.linkedin_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {contact.birthday && (
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span>
                          {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
                            new Date(contact.birthday),
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Current Employment */}
                {(contact.current_position || contact.current_company) && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium mb-3">Current Employment</h3>
                      <div className="flex items-start">
                        <Briefcase className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                        <div>
                          {contact.current_position && <p className="font-medium">{contact.current_position}</p>}
                          {contact.current_company && (
                            <p className="text-muted-foreground">{contact.current_company}</p>
                          )}
                          {contact.years_of_experience && (
                            <p className="text-sm mt-1">{contact.years_of_experience} years of experience</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Career Goals */}
                {(contact.desired_position || contact.salary_expectation) && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium mb-3">Career Goals</h3>
                      <div className="space-y-2">
                        {contact.desired_position && (
                          <div>
                            <p className="text-sm text-muted-foreground">Desired Position</p>
                            <p>{contact.desired_position}</p>
                          </div>
                        )}
                        {contact.salary_expectation && (
                          <div className="flex items-start">
                            <DollarSign className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Salary Expectation</p>
                              <p>{contact.salary_expectation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Profile Info */}
                <div className="text-sm text-muted-foreground">
                  <p>Profile created: {formatDate(contact.createdAt)}</p>
                  <p>Last updated: {formatDate(contact.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="education">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="admin">Admin Notes</TabsTrigger>
            </TabsList>

            {/* Education Tab */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Education History
                  </CardTitle>
                  <CardDescription>Academic background and qualifications</CardDescription>
                </CardHeader>
                <CardContent>
                  {contact.education && contact.education.length > 0 ? (
                    <div className="space-y-8">
                      {contact.education.map((edu, index) => (
                        <div key={index} className="relative pl-6 pb-6 border-l border-muted last:pb-0">
                          <div className="absolute left-0 top-0 -translate-x-1/2 h-4 w-4 rounded-full bg-primary"></div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{edu.institution}</h4>
                            <p>
                              {edu.degree} in {edu.fieldOfStudy}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                            </p>
                            {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No education history available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Professional Experience
                  </CardTitle>
                  <CardDescription>Work history and professional background</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative pl-6 pb-6 border-l border-muted">
                      <div className="absolute left-0 top-0 -translate-x-1/2 h-4 w-4 rounded-full bg-primary"></div>
                      <div className="space-y-1">
                        <h4 className="font-medium">{contact.current_position}</h4>
                        <p>{contact.current_company}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 2)))} - Present
                        </p>
                        <p className="mt-2 text-sm">
                          {`${contact.first_name} has been working as a ${contact.current_position} at ${contact.current_company} for the past 2 years, focusing on ${contact.skills.map((s) => s.name).join(", ")}.`}
                        </p>
                      </div>
                    </div>

                    <div className="relative pl-6 pb-6 border-l border-muted">
                      <div className="absolute left-0 top-0 -translate-x-1/2 h-4 w-4 rounded-full bg-muted"></div>
                      <div className="space-y-1">
                        <h4 className="font-medium">
                          {contact.role && contact.role.includes("Senior")
                            ? contact.role.replace("Senior ", "")
                            : contact.role}
                        </h4>
                        <p>{contact.current_company}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 4)))} -{" "}
                          {formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 2)))}
                        </p>
                      </div>
                    </div>

                    <div className="relative pl-6 border-l border-muted">
                      <div className="absolute left-0 top-0 -translate-x-1/2 h-4 w-4 rounded-full bg-muted"></div>
                      <div className="space-y-1">
                        <h4 className="font-medium">Junior {contact.role}</h4>
                        <p>{companies[Math.floor(Math.random() * companies.length)]}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 6)))} -{" "}
                          {formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 4)))}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Notes Tab */}
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Administrative Notes</CardTitle>
                  <CardDescription>Internal notes and candidate assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  {contact.adminNotes ? (
                    <div className="p-4 bg-muted rounded-md">
                      <p>{contact.adminNotes}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted rounded-md">
                      <p className="text-muted-foreground">No administrative notes available for this contact.</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">CV/Resume</h4>
                    {contact.cv ? (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Download CV
                        </Button>
                        <p className="text-sm text-muted-foreground">{contact.cv.fileName}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No CV/resume uploaded</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button>Schedule Interview</Button>
                      <Button variant="outline">Send Message</Button>
                      <Button variant="secondary">Add to Shortlist</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 