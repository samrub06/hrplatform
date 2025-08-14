"use client"
import { Button } from "@/components/common/button";
import { Card, CardContent } from "@/components/common/card";
import { Input } from "@/components/common/input";

import { motion } from "framer-motion";
import {
  Download,
  Plus,
  Search
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import CandidateCard from "@/components/candidates/CandidateCard";
import CandidateDetails from "@/components/candidates/CandidateDetails";
import CandidateFilters from "@/components/candidates/CandidateFilter";
import { User } from "@/lib/models";
import { Candidate, CandidateFiltersType } from "@/lib/types";

// Fonction utilitaire pour créer les URLs
const createPageUrl = (page: string) => `/${page.toLowerCase()}`;

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [filters, setFilters] = useState<CandidateFiltersType>({
    roleType: "all",
    profileComplete: "all",
    availability: "all"
  });

  useEffect(() => {
    loadCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchTerm, filters]);

  const loadCandidates = async () => {
    setIsLoading(true);
    try {
      const data = await User.list("-created_date", 100);
      setCandidates(data);
    } catch (error) {
      console.error("Error loading candidates:", error);
    }
    setIsLoading(false);
  };

  const filterCandidates = () => {
    let filtered = candidates;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(candidate => {
        const fullName = `${candidate.first_name || ''} ${candidate.last_name || ''}`.toLowerCase();
        const email = (candidate.email || '').toLowerCase();
        const location = (candidate.location || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return fullName.includes(search) || 
               email.includes(search) || 
               location.includes(search);
      });
    }

    // Role type filter
    if (filters.roleType !== "all") {
      filtered = filtered.filter(candidate => 
        candidate.role_type === filters.roleType
      );
    }

    // Profile complete filter
    if (filters.profileComplete !== "all") {
      const isComplete = filters.profileComplete === "complete";
      filtered = filtered.filter(candidate => 
        candidate.profile_complete === isComplete
      );
    }

    // Availability filter
    if (filters.availability !== "all") {
      filtered = filtered.filter(candidate => 
        candidate.availability === filters.availability
      );
    }

    setFilteredCandidates(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Candidate Directory
              </h1>
              <p className="text-slate-600 text-lg">
                Discover and manage your talent pipeline
              </p>
            </div>
            <Link href={createPageUrl("Upload")}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2">
                <Plus className="w-4 h-4" />
                Add Candidate
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search candidates by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>
                <CandidateFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              {isLoading ? "Loading..." : `${filteredCandidates.length} candidates found`}
            </p>
            {filteredCandidates.length > 0 && (
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export Results
              </Button>
            )}
          </div>
        </motion.div>

        {/* Candidates Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="border-0 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-200 h-12 w-12"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCandidates.length === 0 ? (
              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No candidates found</h3>
                  <p className="text-slate-600 mb-4">Try adjusting your search or filters</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({
                        roleType: "all",
                        profileComplete: "all", 
                        availability: "all"
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredCandidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CandidateCard 
                      candidate={candidate}
                      onSelect={setSelectedCandidate}
                      isSelected={selectedCandidate?.id === candidate.id}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Candidate Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CandidateDetails candidate={selectedCandidate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}