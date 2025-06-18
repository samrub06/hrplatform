import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Candidate } from "@/lib/types";
import { format } from "date-fns";
import {
  Briefcase,
  Calendar,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone
} from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  onSelect: (candidate: Candidate | null) => void;
  isSelected: boolean;
}

export default function CandidateCard({ candidate, onSelect, isSelected }: CandidateCardProps) {
  const handleSelect = () => {
    onSelect(isSelected ? null : candidate);
  };

  return (
    <Card 
      className={`border-0 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={handleSelect}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 ring-2 ring-white shadow-sm">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-lg">
                {candidate.first_name && candidate.last_name 
                  ? `${candidate.first_name[0]}${candidate.last_name[0]}`
                  : candidate.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'C'
                }
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {candidate.first_name && candidate.last_name 
                  ? `${candidate.first_name} ${candidate.last_name}`
                  : candidate.full_name || 'Unnamed Candidate'
                }
              </h3>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                {candidate.email && (
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {candidate.email}
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {candidate.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={candidate.profile_complete ? "default" : "secondary"}
              className={candidate.profile_complete 
                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                : "bg-amber-100 text-amber-700 border-amber-200"
              }
            >
              {candidate.profile_complete ? 'Complete' : 'Incomplete'}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {candidate.role_type || 'candidate'}
            </Badge>
          </div>
        </div>

        {candidate.bio && (
          <p className="text-slate-600 mb-4 line-clamp-2">
            {candidate.bio}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          {candidate.location && (
            <div className="flex items-center text-sm text-slate-600">
              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
              {candidate.location}
            </div>
          )}
          {candidate.years_experience && (
            <div className="flex items-center text-sm text-slate-600">
              <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
              {candidate.years_experience} years exp.
            </div>
          )}
          {candidate.availability && (
            <div className="flex items-center text-sm text-slate-600">
              <Clock className="w-4 h-4 mr-2 text-slate-400" />
              Available {candidate.availability.replace('_', ' ')}
            </div>
          )}
          <div className="flex items-center text-sm text-slate-600">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            Joined {format(new Date(candidate.created_date), 'MMM yyyy')}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {candidate.desired_salary && (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                ${candidate.desired_salary.toLocaleString()}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
          >
            {isSelected ? 'Hide Details' : 'View Details'}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}