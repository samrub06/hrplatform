import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select";
import type { CandidateFiltersType } from "@/lib/types";
import { Filter } from "lucide-react";

interface CandidateFiltersProps {
  filters: CandidateFiltersType;
  onFiltersChange: (filters: CandidateFiltersType) => void;
}

export default function CandidateFilters({ filters, onFiltersChange }: CandidateFiltersProps) {
  const updateFilter = (key: keyof CandidateFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Filter className="w-4 h-4 text-slate-400" />
      
      <Select value={filters.roleType} onValueChange={(value) => updateFilter('roleType', value)}>
        <SelectTrigger className="w-32 border-0 bg-slate-50 focus:bg-white">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="candidate">Candidate</SelectItem>
          <SelectItem value="recruiter">Recruiter</SelectItem>
          <SelectItem value="referee">Referee</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.profileComplete} onValueChange={(value) => updateFilter('profileComplete', value)}>
        <SelectTrigger className="w-36 border-0 bg-slate-50 focus:bg-white">
          <SelectValue placeholder="Profile" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Profiles</SelectItem>
          <SelectItem value="complete">Complete</SelectItem>
          <SelectItem value="incomplete">Incomplete</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value)}>
        <SelectTrigger className="w-36 border-0 bg-slate-50 focus:bg-white">
          <SelectValue placeholder="Availability" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="immediately">Immediately</SelectItem>
          <SelectItem value="2_weeks">2 Weeks</SelectItem>
          <SelectItem value="1_month">1 Month</SelectItem>
          <SelectItem value="3_months">3 Months</SelectItem>
          <SelectItem value="not_available">Not Available</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
