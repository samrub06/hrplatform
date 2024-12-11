export type UpdateJobDto = {
    id?: string;
    name?: string;
    description?: string;
    salary_offered?: number;
    skills?: Array<string>;
    global_year_experience?: number;
    city?: string;
    work_condition?: string;
    company_name?: string;
    company_type?: string;
    contact_name?: string;
    phone_number?: string;
    email_address?: string;
};
