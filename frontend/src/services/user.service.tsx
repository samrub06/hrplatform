import axiosInstance from '../utils/axiosInstance';


export const checkPermission = async () => {
  const response = await axiosInstance.get(`/user/me/permissions`);
  return response.data;
};

export const GetUserById = async (id: any) => {
  const response = await axiosInstance.get(`/user/${id}`);
  return response.data;
};

export const updateUser = async (id: string, updateUserDto :any) => {
  const response = await axiosInstance.patch(`/user/${id}`, updateUserDto, 
  );
  return response.data;
}; 

export const updateUserRole = async (id: string, role: any) => {
  const response = await axiosInstance.patch(`/user/role/${id}`, { role });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get('/user');
  return response.data;
};

export const updateUserNotes = async (userId: string, notes: string) => {
  const response = await axiosInstance.patch(`/user/${userId}`, { adminNotes: notes });
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axiosInstance.delete(`/user/${userId}`);
  return response.data;
};

export const createUser = async (values: any) => {
  const response = await axiosInstance.post(`/user`,values);
  return response.data;
};

export const getAllPublishers = async () => {
  const response = await axiosInstance.post('/user/all-publishers');
  return response.data;
};