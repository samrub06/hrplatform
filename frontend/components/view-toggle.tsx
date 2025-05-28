'use client'

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Grid, List } from "lucide-react"

interface ViewToggleProps {
  viewMode: "card" | "table"
  onViewChange: (mode: "card" | "table") => void
}

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">View:</span>
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => value && onViewChange(value as "card" | "table")}
      >
        <ToggleGroupItem value="card" aria-label="Card View">
          <Grid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="table" aria-label="Table View">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}