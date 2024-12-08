export interface Skill {
  language: string;
  experience_years: number;
  level?: number; // optionnel, par défaut égal à experience_years
}

export interface Position {
  name: string;
  description?: string;
}

