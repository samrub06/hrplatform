"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/avatar"
import { Badge } from "@/components/common/badge"
import { Button } from "@/components/common/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/table"
import { UserData } from "@/lib/types"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SearchBar } from "../../../components/common/search-bar"
import { ViewToggle } from "../../../components/common/view-toggle"
import { Pagination } from "../../../components/layout/pagination"

// Generate a larger sample dataset (100 users)
const generateSampleContacts = (count: number): UserData[] => {
  const skills = [
    { name: "React", years_of_experience: 3 },
    { name: "TypeScript", years_of_experience: 2 },
    { name: "CSS", years_of_experience: 4 },
    { name: "Node.js", years_of_experience: 3 },
    { name: "Python", years_of_experience: 5 },
    { name: "MongoDB", years_of_experience: 2 },
    { name: "PostgreSQL", years_of_experience: 3 },
    { name: "AWS", years_of_experience: 2 },
    { name: "Docker", years_of_experience: 1 },
    { name: "Kubernetes", years_of_experience: 1 },
    { name: "UI/UX", years_of_experience: 4 },
    { name: "Figma", years_of_experience: 3 },
    { name: "Java", years_of_experience: 6 },
    { name: "C#", years_of_experience: 4 },
    { name: "PHP", years_of_experience: 3 },
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
      current_position: `Senior ${position}`,
      current_company: company,
      createdAt: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      updatedAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      profilePicture: `/placeholder.svg?height=100&width=100&text=${firstName[0]}${lastName[0]}`,
    }
  })
}

const sampleContacts = generateSampleContacts(100)

export default function ContactsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("name")
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [filteredContacts, setFilteredContacts] = useState<UserData[]>(sampleContacts)

  // Calculate pagination
  const totalContacts = filteredContacts.length
  const totalPages = Math.ceil(totalContacts / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalContacts)
  const currentContacts = filteredContacts.slice(startIndex, endIndex)

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredContacts(sampleContacts)
      setCurrentPage(1)
      return
    }

    const query = searchQuery.toLowerCase()

    const filtered = sampleContacts.filter((contact) => {
      if (searchType === "name") {
        return (contact.first_name?.toLowerCase() || '').includes(query) || (contact.last_name?.toLowerCase() || '').includes(query)
      } else if (searchType === "specialty") {
        return contact.skills?.some((skill) => skill.name.toLowerCase().includes(query)) || false
      } else if (searchType === "company") {
        return contact.current_company?.toLowerCase().includes(query) || false
      }
      return false
    })

    setFilteredContacts(filtered)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const handleViewProfile = (contactId: string) => {
    router.push(`/contacts/${contactId}`)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Contacts Directory</h1>

      <SearchBar
        searchQuery={searchQuery}
        searchType={searchType}
        onSearchChange={setSearchQuery}
        onTypeChange={setSearchType}
        onSearch={handleSearch}
      />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{endIndex} of {totalContacts} contacts
          </span>
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Show:</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="12" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>
      ) : (
        <ContactTable
          contacts={currentContacts}
          onViewProfile={handleViewProfile}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

function ContactCard({ contact, onViewProfile }: { contact: UserData; onViewProfile: (id: string) => void }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={contact.profilePicture || "/placeholder.svg"}
                alt={`${contact.first_name || 'Unknown'} ${contact.last_name || 'User'}`}
              />
              <AvatarFallback>
                {contact.first_name?.[0] || 'U'}
                {contact.last_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">
                {contact.first_name || 'Unknown'} {contact.last_name || 'User'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{contact.role || "No role specified"}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Contact Information</p>
            <div className="grid gap-1 mt-1">
              <p className="text-sm">{contact.email}</p>
              {contact.phone_number && <p className="text-sm">{contact.phone_number}</p>}
            </div>
          </div>

          {contact.current_position && contact.current_company && (
            <div>
              <p className="text-sm font-medium">Current Employment</p>
              <div className="grid gap-1 mt-1">
                <p className="text-sm">{contact.current_position}</p>
                <p className="text-sm text-muted-foreground">{contact.current_company}</p>
              </div>
            </div>
          )}

          {contact.skills && contact.skills.length > 0 && (
            <div>
              <p className="text-sm font-medium">Skills</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {contact.skills.map((skill) => (
                  <Badge key={skill.name} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => onViewProfile(contact.id || '')}>
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ContactTable({ contacts, onViewProfile }: { contacts: UserData[]; onViewProfile: (id: string) => void }) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No contacts found matching your search criteria.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Skills</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={contact.profilePicture || "/placeholder.svg"}
                    alt={`${contact.first_name || 'Unknown'} ${contact.last_name || 'User'}`}
                  />
                  <AvatarFallback>
                    {contact.first_name?.[0] || 'U'}
                    {contact.last_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {contact.first_name || 'Unknown'} {contact.last_name || 'User'}
                </span>
              </div>
            </TableCell>
            <TableCell>{contact.role || "—"}</TableCell>
            <TableCell>{contact.current_company || "—"}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {contact.skills?.slice(0, 3).map((skill) => (
                  <Badge key={skill.name} variant="secondary" className="mr-1">
                    {skill.name}
                  </Badge>
                ))}
                {contact.skills && contact.skills.length > 3 && (
                  <Badge variant="secondary" className="mr-1">
                    +{contact.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>—</TableCell>
            <TableCell>
              <div className="text-sm">
                <p>{contact.email}</p>
                <p>{contact.phone_number}</p>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onViewProfile(contact.id || '')}>
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View profile</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
