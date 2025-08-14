import { Button } from "@/components/common/button";
import { Avatar, AvatarFallback } from "@/components/common/avatar";
import { Badge } from "@/components/common/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card";
import { Separator } from "@/components/common/separator";

import { CV, Experience, Skill } from "@/lib/models";
import type { Candidate, CandidateData } from "@/lib/types";
import { format } from "date-fns";
import {
    Briefcase,
    Clock,
    Download,
    ExternalLink,
    Github,
    Globe,
    GraduationCap,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Star
} from "lucide-react";
import { useEffect, useState } from "react";

interface CandidateDetailsProps {
  candidate: Candidate | null;
}

export default function CandidateDetails({ candidate }: CandidateDetailsProps) {
  const [candidateData, setCandidateData] = useState<CandidateData>({
    cvs: [],
    skills: [],
    experiences: []
  });

  useEffect(() => {
    if (candidate) {
      loadCandidateDetails();
    }
  }, [candidate]);

  const loadCandidateDetails = async () => {
    if (!candidate) return;
    
    try {
      const [cvs, skills, experiences] = await Promise.all([
        CV.filter({ user_id: candidate.id }),
        Skill.filter({ user_id: candidate.id }),
        Experience.filter({ user_id: candidate.id })
      ]);

      setCandidateData({
        cvs,
        skills,
        experiences
      });
    } catch (error) {
      console.error("Error loading candidate details:", error);
    }
  };

  if (!candidate) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a Candidate</h3>
          <p className="text-slate-600">
            Click on a candidate card to view their detailed profile
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
              {candidate.first_name && candidate.last_name 
                ? `${candidate.first_name[0]}${candidate.last_name[0]}`
                : candidate.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'C'
              }
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-slate-900">
              {candidate.first_name && candidate.last_name 
                ? `${candidate.first_name} ${candidate.last_name}`
                : candidate.full_name || 'Unnamed Candidate'
              }
            </CardTitle>
            <p className="text-sm text-slate-600 capitalize">
              {candidate.role_type || 'candidate'}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Contact Information</h4>
          <div className="space-y-2">
            {candidate.email && (
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="w-4 h-4 mr-3 text-slate-400" />
                <a href={`mailto:${candidate.email}`} className="hover:text-blue-600">
                  {candidate.email}
                </a>
              </div>
            )}
            {candidate.phone && (
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="w-4 h-4 mr-3 text-slate-400" />
                <a href={`tel:${candidate.phone}`} className="hover:text-blue-600">
                  {candidate.phone}
                </a>
              </div>
            )}
            {candidate.location && (
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                {candidate.location}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Links */}
        {(candidate.portfolio_url || candidate.linkedin_url || candidate.github_url) && (
          <>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Links</h4>
              <div className="space-y-2">
                {candidate.portfolio_url && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Globe className="w-4 h-4 mr-3 text-slate-400" />
                    <a 
                      href={candidate.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 flex items-center"
                    >
                      Portfolio
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
                {candidate.linkedin_url && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Linkedin className="w-4 h-4 mr-3 text-slate-400" />
                    <a 
                      href={candidate.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 flex items-center"
                    >
                      LinkedIn
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
                {candidate.github_url && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Github className="w-4 h-4 mr-3 text-slate-400" />
                    <a 
                      href={candidate.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 flex items-center"
                    >
                      GitHub
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Professional Info */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Professional Details</h4>
          <div className="grid grid-cols-2 gap-4">
            {candidate.years_experience && (
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <Briefcase className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                <p className="text-sm font-medium text-slate-900">{candidate.years_experience}</p>
                <p className="text-xs text-slate-500">Years Exp.</p>
              </div>
            )}
            {candidate.desired_salary && (
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <Star className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                <p className="text-sm font-medium text-slate-900">${candidate.desired_salary.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Desired Salary</p>
              </div>
            )}
            {candidate.availability && (
              <div className="text-center p-3 bg-slate-50 rounded-lg col-span-2">
                <Clock className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                <p className="text-sm font-medium text-slate-900 capitalize">
                  {candidate.availability.replace('_', ' ')}
                </p>
                <p className="text-xs text-slate-500">Availability</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* CVs */}
        {candidateData.cvs.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              CVs ({candidateData.cvs.length})
            </h4>
            <div className="space-y-2">
              {candidateData.cvs.map((cv) => (
                <div key={cv.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{cv.file_name}</p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(cv.created_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a href={cv.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {candidateData.skills.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Skills ({candidateData.skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {candidateData.skills.slice(0, 10).map((skill) => (
                  <Badge 
                    key={skill.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {skill.skill_name}
                  </Badge>
                ))}
                {candidateData.skills.length > 10 && (
                  <Badge variant="outline" className="text-xs">
                    +{candidateData.skills.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}

        {/* Recent Experience */}
        {candidateData.experiences.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Recent Experience
              </h4>
              <div className="space-y-3">
                {candidateData.experiences.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-900 text-sm">{exp.position_title}</p>
                    <p className="text-xs text-slate-600">{exp.company_name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {format(new Date(exp.start_date), 'MMM yyyy')} - 
                      {exp.is_current ? ' Present' : format(new Date(exp.end_date!), 'MMM yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Admin Notes */}
        {candidate.admin_notes && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Admin Notes</h4>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">{candidate.admin_notes}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}