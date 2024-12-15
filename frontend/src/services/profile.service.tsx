import axiosInstance from '../utils/axiosInstance';

export const getPublicProfile = async (token: string) => {
  const response = await axiosInstance.get(`/user/profile/public/${token}`);
  return response.data;
};

export const generatePublicLink = async (userId: string): Promise<string> => {
  const response = await axiosInstance.post(`/user/${userId}/public-link`);
  return response.data;
}; 