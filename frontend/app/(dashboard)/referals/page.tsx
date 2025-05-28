"use client"

import React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowUpDown,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Download,
  Filter,
  MapPin,
  MoreHorizontal,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

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

// Generate sample job data
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
    "We are looking for an experienced developer to join our team and help build innovative solutions for our clients.",
    "Join our growing team to work on cutting-edge technologies and challenging projects.",
    "Help us build the next generation of our platform with modern technologies and best practices.",
    "Work with a talented team to design, develop, and deploy scalable applications.",
    "Be part of a dynamic team working on products that impact millions of users worldwide.",
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

// Get unique values for filters
const getUniqueValues = (jobs: Job[], key: keyof Job): string[] => {
  return Array.from(new Set(jobs.map((job) => String(job[key]))))
}

// Get unique skills from all jobs
const getUniqueSkills = (jobs: Job[]) => {
  const skillsSet = new Set<string>()
  jobs.forEach((job) => {
    job.skills.forEach((skill) => {
      skillsSet.add(skill.name)
    })
  })
  return Array.from(skillsSet)
}

export default function JobListingsPage() {
  
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState<keyof Job>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filters
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [selectedWorkConditions, setSelectedWorkConditions] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [experienceRange, setExperienceRange] = useState<[number, number]>([0, 10])
  const [salaryRange, setSalaryRange] = useState<[number, number]>([50000, 200000])

  // Get unique values for filters
  const uniqueCompanies = useMemo(() => getUniqueValues(sampleJobs, "company_name"), [])
  const uniqueWorkConditions = ["onsite", "remote", "hybrid"]
  const uniqueSkills = useMemo(() => getUniqueSkills(sampleJobs), [])

  // Filter jobs based on all criteria
  const filteredJobs = useMemo(() => {
    return sampleJobs.filter((job) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase())

      // Company filter
      const matchesCompany = selectedCompanies.length === 0 || selectedCompanies.includes(job.company_name)

      // Work condition filter
      const matchesWorkCondition =
        selectedWorkConditions.length === 0 || selectedWorkConditions.includes(job.work_condition)

      // Skills filter
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.some((skill) => job.skills.some((jobSkill) => jobSkill.name === skill))

      // Experience filter
      const matchesExperience =
        job.global_year_experience >= experienceRange[0] && job.global_year_experience <= experienceRange[1]

      // Salary filter
      const matchesSalary = job.salary_offered >= salaryRange[0] && job.salary_offered <= salaryRange[1]

      return (
        matchesSearch && matchesCompany && matchesWorkCondition && matchesSkills && matchesExperience && matchesSalary
      )
    })
  }, [searchQuery, selectedCompanies, selectedWorkConditions, selectedSkills, experienceRange, salaryRange])

  // Sort jobs
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Special handling for nested or complex fields
      if (sortField === "skills") {
        aValue = a.skills.length
        bValue = b.skills.length
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [filteredJobs, sortField, sortDirection])

  // Calculate pagination
  const totalJobs = sortedJobs.length
  const totalPages = Math.ceil(totalJobs / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalJobs)
  const currentJobs = sortedJobs.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const handleSort = (field: keyof Job) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleViewJob = (jobId: number) => {
    router.push(`referals/${jobId}`)
  }

  const handleExportData = () => {
    // Create CSV content
    const headers = [
      "ID",
      "Job Title",
      "Company",
      "Location",
      "Work Condition",
      "Experience Required",
      "Salary",
      "Skills",
      "Posted Date",
    ]

    const csvRows = [
      headers.join(","),
      ...sortedJobs.map((job) =>
        [
          job.id,
          `"${job.name}"`,
          `"${job.company_name}"`,
          `"${job.city}"`,
          job.work_condition,
          job.global_year_experience,
          job.salary_offered,
          `"${job.skills.map((s) => s.name).join("; ")}"`,
          new Date(job.createdAt).toLocaleDateString(),
        ].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "job_listings.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetFilters = () => {
    setSelectedCompanies([])
    setSelectedWorkConditions([])
    setSelectedSkills([])
    setExperienceRange([0, 10])
    setSalaryRange([50000, 200000])
    setSearchQuery("")
    setCurrentPage(1)
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
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date))
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Listings</h1>
        <Button onClick={handleExportData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-3/4">
          <div className="flex w-full gap-2 mb-4">
            <Input
              placeholder="Search jobs, companies, or descriptions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1"
            />
            <Button onClick={() => setSearchQuery("")} variant="outline">
              Clear
            </Button>
          </div>
        </div>

        <div className="w-full md:w-1/4 flex justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {(selectedCompanies.length > 0 ||
                  selectedWorkConditions.length > 0 ||
                  selectedSkills.length > 0 ||
                  experienceRange[0] > 0 ||
                  experienceRange[1] < 10 ||
                  salaryRange[0] > 50000 ||
                  salaryRange[1] < 200000) && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Jobs</SheetTitle>
                <SheetDescription>Narrow down job listings based on your preferences</SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                {/* Work Condition Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Work Condition</h3>
                  <div className="space-y-2">
                    {uniqueWorkConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`condition-${condition}`}
                          checked={selectedWorkConditions.includes(condition)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedWorkConditions([...selectedWorkConditions, condition])
                            } else {
                              setSelectedWorkConditions(selectedWorkConditions.filter((c) => c !== condition))
                            }
                            setCurrentPage(1)
                          }}
                        />
                        <label htmlFor={`condition-${condition}`} className="text-sm capitalize cursor-pointer">
                          {condition}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Range Filter */}
                <div>
                  <div className="flex justify-between mb-3">
                    <h3 className="text-sm font-medium">Years of Experience</h3>
                    <span className="text-sm text-muted-foreground">
                      {experienceRange[0]} - {experienceRange[1]}+ years
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 10]}
                    min={0}
                    max={10}
                    step={1}
                    value={experienceRange}
                    onValueChange={(value) => {
                      setExperienceRange(value as [number, number])
                      setCurrentPage(1)
                    }}
                    className="mb-6"
                  />
                </div>

                {/* Salary Range Filter */}
                <div>
                  <div className="flex justify-between mb-3">
                    <h3 className="text-sm font-medium">Salary Range</h3>
                    <span className="text-sm text-muted-foreground">
                      {formatSalary(salaryRange[0])} - {formatSalary(salaryRange[1])}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[50000, 200000]}
                    min={50000}
                    max={200000}
                    step={5000}
                    value={salaryRange}
                    onValueChange={(value) => {
                      setSalaryRange(value as [number, number])
                      setCurrentPage(1)
                    }}
                    className="mb-6"
                  />
                </div>

                {/* Skills Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Skills</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {uniqueSkills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSkills([...selectedSkills, skill])
                            } else {
                              setSelectedSkills(selectedSkills.filter((s) => s !== skill))
                            }
                            setCurrentPage(1)
                          }}
                        />
                        <label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer">
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Companies</h3>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {uniqueCompanies.map((company) => (
                      <div key={company} className="flex items-center space-x-2">
                        <Checkbox
                          id={`company-${company}`}
                          checked={selectedCompanies.includes(company)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCompanies([...selectedCompanies, company])
                            } else {
                              setSelectedCompanies(selectedCompanies.filter((c) => c !== company))
                            }
                            setCurrentPage(1)
                          }}
                        />
                        <label htmlFor={`company-${company}`} className="text-sm cursor-pointer">
                          {company}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={resetFilters} variant="outline" className="mr-2">
                    Reset All
                  </Button>
                  <SheetTrigger asChild>
                    <Button>Apply Filters</Button>
                  </SheetTrigger>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{endIndex} of {totalJobs} jobs
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Show:</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                      Job Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("company_name")}>
                      Company
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("city")}>
                      Location
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("work_condition")}>
                      Work Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort("global_year_experience")}
                    >
                      Experience
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("salary_offered")}>
                      Salary
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("createdAt")}>
                      Posted
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentJobs.length > 0 ? (
                  currentJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          {job.company_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {job.city}
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>{job.global_year_experience}+ years</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                          {formatSalary(job.salary_offered)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="mr-1">
                              {skill.name}
                            </Badge>
                          ))}
                          {job.skills.length > 2 && <Badge variant="outline">+{job.skills.length - 2}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(job.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewJob(job.id)}>View details</DropdownMenuItem>
                            <DropdownMenuItem>Apply for job</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Save job</DropdownMenuItem>
                            <DropdownMenuItem>Share job</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                      <Button variant="outline" onClick={resetFilters} className="mt-2">
                        Reset Filters
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, current page, and pages around current page
                return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
              })
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
