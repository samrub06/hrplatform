"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Share2,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Job interface
interface Job {
  id: number
  name: string
  description: string
  salary_offered: number
  skills: {
    name: string
    years_required: number
  }[]
  global_year_experience: number
  city: string
  work_condition: "onsite" | "remote" | "hybrid"
  company_name: string
  userId: string
  link_referral: string
  contact_name: string
  phone_number: string
  email_address: string
  createdAt: Date
  updatedAt: Date
}

// Generate sample job data (same as in the listing page)
const generateSampleJobs = (count: number): Job[] => {
  const jobTitles = [
    "Frontend Developer",
    "Backend Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "UX Designer",
    "Product Manager",
    "QA Engineer",
    "Mobile Developer",
    "Machine Learning Engineer",
    "Cloud Architect",
    "Blockchain Developer",
    "Security Engineer",
    "Technical Writer",
    "Systems Administrator",
  ]

  const companies = [
    "Tech Innovations Inc.",
    "Digital Solutions Co.",
    "Future Systems",
    "Cloud Enterprises",
    "Data Dynamics",
    "Web Frontier",
    "Mobile Masters",
    "AI Research Labs",
    "Secure Networks",
    "Global Software",
  ]

  const cities = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Chicago, IL",
    "Los Angeles, CA",
    "Denver, CO",
    "Atlanta, GA",
    "Portland, OR",
    "Remote",
  ]

  const workConditions: Array<"onsite" | "remote" | "hybrid"> = ["onsite", "remote", "hybrid"]

  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Python",
    "Java",
    "C#",
    "Go",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "GraphQL",
    "REST API",
    "CI/CD",
    "Git",
    "Figma",
    "Adobe XD",
    "Sketch",
  ]

  const jobDescriptions = [
    "We are looking for an experienced developer to join our team and help build innovative solutions for our clients. The ideal candidate will have strong problem-solving skills and experience with modern development practices.\n\nResponsibilities:\n• Design and implement new features and functionality\n• Write clean, maintainable code\n• Collaborate with cross-functional teams\n• Participate in code reviews\n• Troubleshoot and debug applications\n\nRequirements:\n• Strong proficiency in relevant programming languages\n• Experience with relevant frameworks and tools\n• Good understanding of data structures and algorithms\n• Excellent communication skills\n• Ability to work in a fast-paced environment",
    "Join our growing team to work on cutting-edge technologies and challenging projects. You'll be part of a dynamic team that values innovation and continuous learning.\n\nResponsibilities:\n• Develop and maintain high-quality software\n• Collaborate with product managers to define requirements\n• Implement best practices for software development\n• Mentor junior developers\n• Stay up-to-date with emerging trends\n\nRequirements:\n• Bachelor's degree in Computer Science or related field\n• Proven experience in software development\n• Strong analytical and problem-solving skills\n• Experience with agile development methodologies\n• Excellent teamwork and communication skills",
    "Help us build the next generation of our platform with modern technologies and best practices. We're looking for someone who is passionate about creating exceptional user experiences.\n\nResponsibilities:\n• Build efficient, testable, and reusable code\n• Solve complex performance problems\n• Implement security and data protection measures\n• Integrate with third-party services and APIs\n• Collaborate with the design team\n\nRequirements:\n• Strong experience with relevant technologies\n• Knowledge of software architecture patterns\n• Experience with database design\n• Understanding of CI/CD pipelines\n• Passion for clean, maintainable code",
    "Work with a talented team to design, develop, and deploy scalable applications. You'll have the opportunity to work on innovative projects that impact millions of users.\n\nResponsibilities:\n• Develop new user-facing features\n• Build reusable components and libraries\n• Optimize applications for maximum speed and scalability\n• Collaborate with other team members and stakeholders\n• Ensure the technical feasibility of UI/UX designs\n\nRequirements:\n• Proficiency in relevant programming languages and frameworks\n• Experience with responsive design\n• Understanding of cross-browser compatibility issues\n• Familiarity with code versioning tools\n• Good time-management skills",
    "Be part of a dynamic team working on products that impact millions of users worldwide. We're looking for someone who thrives in a collaborative environment and is committed to excellence.\n\nResponsibilities:\n• Write application-level code with a focus on performance\n• Implement automated testing platforms and unit tests\n• Collaborate with frontend developers and designers\n• Participate in all phases of the development lifecycle\n• Troubleshoot production issues\n\nRequirements:\n• Proven work experience in software development\n• Experience with relevant databases and data structures\n• Understanding of fundamental design principles\n• Knowledge of user authentication and authorization\n• Excellent problem-solving skills",
  ]

  return Array.from({ length: count }, (_, i) => {
    const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)]
    const company = companies[Math.floor(Math.random() * companies.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const workCondition = workConditions[Math.floor(Math.random() * workConditions.length)]
    const description = jobDescriptions[Math.floor(Math.random() * jobDescriptions.length)]
    const globalYearExperience = Math.floor(Math.random() * 10) + 1
    const salary = (Math.floor(Math.random() * 150) + 50) * 1000

    // Generate 3-6 required skills
    const requiredSkills = []
    const skillCount = Math.floor(Math.random() * 4) + 3
    const availableSkills = [...skills]

    for (let j = 0; j < skillCount; j++) {
      if (availableSkills.length === 0) break
      const randomIndex = Math.floor(Math.random() * availableSkills.length)
      const skillName = availableSkills[randomIndex]
      availableSkills.splice(randomIndex, 1)

      requiredSkills.push({
        name: skillName,
        years_required: Math.floor(Math.random() * 5) + 1,
      })
    }

    // Generate creation date (within the last 30 days)
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))

    // Generate update date (after creation date)
    const updatedAt = new Date(createdAt)
    updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 5))

    return {
      id: i + 1,
      name: jobTitle,
      description: description,
      salary_offered: salary,
      skills: requiredSkills,
      global_year_experience: globalYearExperience,
      city: city,
      work_condition: workCondition,
      company_name: company,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      link_referral: `https://example.com/jobs/refer/${i + 1}`,
      contact_name: `Recruiter ${Math.floor(Math.random() * 100) + 1}`,
      phone_number: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email_address: `jobs@${company.toLowerCase().replace(/\s+/g, "")}.com`,
      createdAt: createdAt,
      updatedAt: updatedAt,
    }
  })
}

const sampleJobs = generateSampleJobs(100)

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const jobId = Number.parseInt(params.id)
    const foundJob = sampleJobs.find((j) => j.id === jobId)
    setJob(foundJob || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[50vh]">
        <p>Loading job details...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => router.push("/referals")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Job Not Found</CardTitle>
            <CardDescription>The job you are looking for does not exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date))
  }

  const daysAgo = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => router.push("/referals")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Job Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{job.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building className="h-4 w-4 mr-1" />
                    {job.company_name}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Bookmark className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  {job.city}
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                  {formatSalary(job.salary_offered)}
                </div>
                <div className="flex items-center text-sm">
                  <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                  {job.global_year_experience}+ years experience
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  Posted {daysAgo(job.createdAt)}
                </div>
                <Badge
                  variant={
                    job.work_condition === "remote"
                      ? "outline"
                      : job.work_condition === "hybrid"
                        ? "secondary"
                        : "default"
                  }
                >
                  {job.work_condition}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Job Description</h3>
                <div className="whitespace-pre-line text-sm">{job.description}</div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">Required Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="secondary">{skill.years_required}+ years</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">About the Company</h3>
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-md p-4 flex items-center justify-center w-16 h-16">
                    <Building className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{job.company_name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {job.company_name} is a leading company in the technology sector, focused on delivering innovative
                      solutions to clients worldwide. With a team of talented professionals, they strive to create
                      products that make a difference.
                    </p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Visit Website
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="text-sm text-muted-foreground">
                <p>Job ID: {job.id}</p>
                <p>Last updated: {formatDate(job.updatedAt)}</p>
              </div>
              <Button className="flex items-center gap-2">Apply Now</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar - Contact & Application */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Apply for this Job</Button>
                <p className="text-sm text-center text-muted-foreground">or use the referral link below</p>
                <div className="flex items-center p-2 bg-muted rounded-md text-sm">
                  <input
                    type="text"
                    value={job.link_referral}
                    readOnly
                    className="bg-transparent flex-1 outline-none"
                  />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{job.contact_name}</p>
                    <p className="text-sm text-muted-foreground">Recruiter</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <a href={`mailto:${job.email_address}`} className="text-sm hover:underline">
                    {job.email_address}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <a href={`tel:${job.phone_number}`} className="text-sm hover:underline">
                    {job.phone_number}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleJobs
                  .filter(
                    (j) =>
                      j.id !== job.id &&
                      (j.name.includes(job.name.split(" ")[0]) ||
                        j.skills.some((s) => job.skills.some((js) => js.name === s.name))),
                  )
                  .slice(0, 3)
                  .map((similarJob) => (
                    <div key={similarJob.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <h4
                        className="font-medium hover:underline cursor-pointer"
                        onClick={() => router.push(`referals/${similarJob.id}`)}
                      >
                        {similarJob.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{similarJob.company_name}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {similarJob.city}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formatSalary(similarJob.salary_offered)}
                        </span>
                      </div>
                    </div>
                  ))}
                <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                  View All Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
