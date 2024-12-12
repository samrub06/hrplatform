import axiosInstance from "../utils/axiosInstance";

export const Login = async (id: any) => {
  const response = await axiosInstance.get(`/user/${id}`);
  return response.data;
};

export const Register = async (id: any) => {
  const response = await axiosInstance.get(`/user/${id}`);
  return response.data;
};