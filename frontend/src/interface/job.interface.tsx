export interface Job {
  id: number;
  name: string;
  description: string;
  salary_offered: number;
  skills: {
    name: string;
    years_required: number;
  }[];
  global_year_experience: number;
  city: string;
  work_condition: 'onsite' | 'remote' | 'hybrid';
  company_name: string;
  company_type: 'startup' | 'enterprise' | 'smb' | 'consulting';
  contact_name: string;
  phone_number: string;
  email_address: string;
  createdAt: Date;
  updatedAt: Date;
} 