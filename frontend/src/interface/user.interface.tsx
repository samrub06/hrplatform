import { Skill } from "./skill.interface";

export interface UserData {
  id: number;
  first_name:string
  last_name:string
  email: string;
  cv?: string | null; // Ajoutez la propriété cv ici
  role?: string; // Ajoutez cette ligne pour inclure le rôle
  adminNotes?: string;
  profilePicture?: string;
  skills: Skill[];
  desired_position?: string;  
  createdAt: Date;
  updatedAt:Date;
  // Ajoutez d'autres propriétés si nécessaire
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  VIEWER = 'viewer',
}
