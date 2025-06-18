import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  FileText,
  LucideIcon,
  Star,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";

import ActivityFeed from "./ActivityFeed";
import RecentCandidates from "./RecentCandidates";

// Fonction utilitaire pour créer les URLs
const createPageUrl = (page: string) => `/${page.toLowerCase()}`;

interface User {
  id: string;
  first_name: string;
  last_name: string;
  role_type?: string;
  created_date?: string;
  profile_complete?: boolean;
}

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

interface CV {
  id: string;
  created_date: string;
}

interface Skill {
  id: string;
  created_date: string;
}

interface Experience {
  id: string;
  created_date: string;
}

// Mock des modèles de données (à remplacer par de vrais appels API)
const User = {
  list: async (): Promise<User[]> => {
    // Mock implementation
    return [];
  },
  me: async (): Promise<User | null> => {
    // Mock implementation
    return null;
  }
};

const CV = {
  list: async (): Promise<CV[]> => {
    // Mock implementation
    return [];
  }
};

const Skill = {
  list: async (): Promise<Skill[]> => {
    // Mock implementation
    return [];
  }
};

const Experience = {
  list: async (): Promise<Experience[]> => {
    // Mock implementation
    return [];
  }
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend: string;
  isLoading: boolean;
}

export function StatsCard({ title, value, icon: Icon, color, trend, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-green-600">{trend}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalCVs: 0,
    totalSkills: 0,
    totalExperience: 0
  });
  const [recentCandidates, setRecentCandidates] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [users, cvs, skills, experiences, user] = await Promise.all([
        User.list(),
        CV.list(),
        Skill.list(),
        Experience.list(),
        User.me()
      ]);

      // Filter out users who are just the current user for candidate stats
      const candidates = users.filter((u: User) => u.role_type === 'candidate' || !u.role_type);

      setStats({
        totalCandidates: candidates.length,
        totalCVs: cvs.length,
        totalSkills: skills.length,
        totalExperience: experiences.length
      });

      setRecentCandidates(users.slice(0, 6));
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const quickActions = [
    {
      title: "Browse Candidates",
      description: "View all candidate profiles",
      icon: Users,
      color: "from-purple-500 to-purple-600", 
      link: createPageUrl("Candidates")
    },
    {
      title: "Admin Panel",
      description: "Manage users and settings",
      icon: Briefcase,
      color: "from-indigo-500 to-indigo-600",
      link: createPageUrl("Admin")
    },
    {
        title: "Browse Jobs",
        description: "See all open positions",
        icon: Briefcase,
        color: "from-green-500 to-green-600",
        link: createPageUrl("Jobs")
    }
  ];

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
                Welcome back{currentUser?.first_name ? `, ${currentUser.first_name}` : ''}
              </h1>
              <p className="text-slate-600 text-lg">
                Here&apos;s what&apos;s happening with your talent pipeline today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500">
                {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Total Candidates"
            value={stats.totalCandidates}
            icon={Users}
            color="from-blue-500 to-blue-600"
            trend="+12% this month"
            isLoading={isLoading}
          />
          <StatsCard
            title="CVs Processed"
            value={stats.totalCVs}
            icon={FileText}
            color="from-green-500 to-green-600"
            trend="+8% this week"
            isLoading={isLoading}
          />
          <StatsCard
            title="Skills Tracked"
            value={stats.totalSkills}
            icon={Star}
            color="from-purple-500 to-purple-600"
            trend="+15% this month"
            isLoading={isLoading}
          />
          <StatsCard
            title="Work Experience"
            value={stats.totalExperience}
            icon={Briefcase}
            color="from-orange-500 to-orange-600"
            trend="+5% this week"
            isLoading={isLoading}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <a key={action.title} href={action.link}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Candidates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <RecentCandidates 
              candidates={recentCandidates as Candidate[]}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ActivityFeed />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
