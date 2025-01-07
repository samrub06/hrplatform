export interface CVExtractedData {
  education: Education[];
  personalInfo: PersonalInfo;
  skills: Skill[];
}

export interface Education {
  period: string;
  description?: string;
  institution?: string;
  degree?: string;
}

export interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  user_id?: string;
}

export interface Skill {
  name: string;
  level?: string;
  description?: string;
  period?: string;
  company?: string;
  location?: string;
  position?: string;
  responsibilities?: string[];
  technologies?: string[];
}
