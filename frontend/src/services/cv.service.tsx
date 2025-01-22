//updateskills

import { Education, Skill } from "../interface/skill.interface";
import axiosInstance from "../utils/axiosInstance";

interface SkillsResponse {
  skills: Skill[];
}

interface EducationResponse {
  education: Education[];
}

export const updateSkills = async (id: string, updateSkillsDto :any) => {
  const response = await axiosInstance.put(`/cv/update-skills/${id}`, updateSkillsDto);
  return response.data;
};
//updateeducation

export const updateEducation = async (  id: string, updateEducationDto :any) => {
  const response = await axiosInstance.put(`/cv/update-education/${id}`, updateEducationDto);
  return response.data;
};

// get skills
export const getSkills = async (id: string) => {
  const response = await axiosInstance.post<SkillsResponse>(`/cv/skills/${id}`);
  return response.data;
};

// get education
export const getEducation = async (id: string) => {
  const response = await axiosInstance.post<EducationResponse>(`/cv/education/${id}`);
  return response.data;
};
