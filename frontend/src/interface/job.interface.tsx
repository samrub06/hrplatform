export interface Alumni {
  id: string;
  userId: string;  // référence à la table user
  currentCompanyName: string;
  currentCompanyType: string;
  currentCompanyLink?: string;
  startDate: Date;
  email: string;      // from user table
  linkedin?: string;  // from user table
  phone?: string;     // from user table
  createdAt: Date;
  updatedAt: Date;
} 

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
  userId:string;
  link_referral: string;
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
