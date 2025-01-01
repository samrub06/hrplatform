export interface Job {
  id: number;
  name: string;
  description: string;
  salary_offered: number;
  skills: {
    name: string;
    years_required: number;
    level: string;
  }[];
  global_year_experience: number;
  city: string;
  work_condition: 'onsite' | 'remote' | 'hybrid';
  company_name: string;
  company_type: 'startup' | 'enterprise' | 'smb' | 'consulting';
  userId:string;
  contact_name: string;
  phone_number: string;
  email_address: string;
  createdAt: Date;
  updatedAt: Date;
} 

export interface GetJobsQuery {
  page: number;
  size: number;
}

export interface JobPaginationResponse {
  pagination: {
    page: number;
    size: number;
    total_pages: number;
    total: number;
  };
  results: Job[];
}
