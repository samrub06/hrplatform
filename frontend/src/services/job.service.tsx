import { Job } from '../interface/job.interface';
import axiosInstance from '../utils/axiosInstance';

const API_URL = 'http://localhost:3000/api/jobs'; // Remplacez par l'URL de votre API

export const getAllJobs = async (): Promise<Job[]> => {
  const response = await axiosInstance.get<Job[]>(API_URL);
  return response.data as Job[];
};

export const getJobById = async (id: number): Promise<Job> => {
  const response = await axiosInstance.get<Job>(`${API_URL}/${id}`);
  return response.data;
};

export const createJob = async (jobData: Job): Promise<Job> => {
  const response = await axiosInstance.post<Job>(API_URL, jobData);
  return response.data;
};

export const updateJob = async (id: number, jobData: Partial<Job>): Promise<Job> => {
  const response = await axiosInstance.patch<Job>(`${API_URL}/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${id}`);
}; 