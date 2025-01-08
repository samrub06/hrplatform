import { Skill } from "./skill.interface";

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  github_link?: string;
  linkedin_link?: string;
  public_profile_url?: string;
  cv?: string | null;
  role?: string;
  adminNotes?: string;
  profilePicture?: string;
  years_of_experience?: number;
  skills: Skill[];
  desired_position?: string;  
  salary_expectation?: string;  
  current_position?: string;
  current_company?: string;
  createdAt: Date;
  updatedAt: Date;
  birthday?: Date;
  education?: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }[];
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  VIEWER = 'viewer',
}
