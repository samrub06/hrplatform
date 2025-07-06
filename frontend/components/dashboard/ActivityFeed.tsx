import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Briefcase,
  Clock,
  FileText,
  Star,
  UserPlus
} from "lucide-react";

export default function ActivityFeed() {
  // Mock activity data - in real app this would come from API
  const activities = [
    {
      id: 1,
      type: "cv_uploaded",
      message: "New CV uploaded by Sarah Johnson",
      time: new Date('2024-01-15T14:30:00Z'), // Timestamp fixe
      icon: FileText,
      color: "text-blue-600 bg-blue-100"
    },
    {
      id: 2,
      type: "candidate_added",
      message: "Michael Chen registered as candidate",
      time: new Date('2024-01-15T14:30:00Z'), // Timestamp fixe
      icon: UserPlus,
      color: "text-green-600 bg-green-100"
    },
    {
      id: 3,
      type: "skills_extracted",
      message: "Skills extracted from Emma Wilson's CV",
      time: new Date('2024-01-15T14:30:00Z'), // Timestamp fixe
      icon: Star,
      color: "text-purple-600 bg-purple-100"
    },
    {
      id: 4,
      type: "profile_completed",
      message: "David Rodriguez completed profile",
        time: new Date('2024-01-15T14:30:00Z'), // Timestamp fixe
      icon: Briefcase,
      color: "text-orange-600 bg-orange-100"
    }
  ];

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-medium">
                  {activity.message}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {format(activity.time, 'h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-center text-sm text-slate-500">
            View all activity in the admin panel
          </p>
        </div>
      </CardContent>
    </Card>
  );
}