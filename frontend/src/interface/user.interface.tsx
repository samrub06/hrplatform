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
  skills: Skill[];
  desired_position?: string;  
  salary_expectation?: string;  
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  VIEWER = 'viewer',
}
