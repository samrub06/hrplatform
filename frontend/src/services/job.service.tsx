import { GetJobsQuery, Job, JobPaginationResponse } from '../interface/job.interface';
import axiosInstance from '../utils/axiosInstance';


export const getAllJobs = async (query: GetJobsQuery): Promise<JobPaginationResponse> => {
  const response = await axiosInstance.post<JobPaginationResponse>('/jobs/search', query);
  return response.data;
};

export const getJobById = async (id: string): Promise<Job> => {
  const response = await axiosInstance.get<Job>(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (jobData: Job): Promise<Job> => {
  const response = await axiosInstance.post<Job>('/jobs', jobData);
  return response.data;
};

export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job> => {
  const response = await axiosInstance.patch<Job>(`/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/jobs/${id}`);
}; 
