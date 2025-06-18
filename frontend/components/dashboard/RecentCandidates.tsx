"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  ExternalLink,
  Link,
  MapPin
} from "lucide-react";

interface Candidate {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  location?: string;
  created_date: string;
  profile_complete: boolean;
  role_type?: string;
}

interface RecentCandidatesProps {
  candidates: Candidate[];
  isLoading: boolean;
}

export default function RecentCandidates({ candidates, isLoading }: RecentCandidatesProps) {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-slate-900">Recent Candidates</CardTitle>
          <Link to={"/candidates"}>
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No candidates yet</h3>
            <p className="text-slate-600 mb-4">Start by uploading candidate profiles</p>
            <Link to={"/upload"}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Add First Candidate
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.map((candidate: Candidate, index: number) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50/50 transition-colors cursor-pointer group"
              >
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
                    <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {candidate.first_name && candidate.last_name 
                        ? `${candidate.first_name} ${candidate.last_name}`
                        : candidate.full_name || 'Unnamed Candidate'
                      }
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      {candidate.location && (
                        <div className="flex items-center text-sm text-slate-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {candidate.location}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(candidate.created_date), 'MMM d')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}