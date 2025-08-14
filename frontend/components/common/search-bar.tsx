'use client'

import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/common/tabs"
import { Briefcase, Code, Search, User } from "lucide-react"

interface SearchBarProps {
  searchQuery: string
  searchType: string
  onSearchChange: (query: string) => void
  onTypeChange: (type: string) => void
  onSearch: () => void
}

export function SearchBar({
  searchQuery,
  searchType,
  onSearchChange,
  onTypeChange,
  onSearch
}: SearchBarProps) {
  return (
    <div className="mb-8">
      <Tabs defaultValue={searchType} onValueChange={onTypeChange}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
          <TabsList>
            <TabsTrigger value="name" className="flex items-center gap-2">
              <User size={16} />
              <span>Name</span>
            </TabsTrigger>
            <TabsTrigger value="specialty" className="flex items-center gap-2">
              <Code size={16} />
              <span>Specialty</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Briefcase size={16} />
              <span>Company</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex w-full max-w-md gap-2">
            <Input
              placeholder={`Search by ${searchType}...`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1"
            />
            <Button onClick={onSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  )
}