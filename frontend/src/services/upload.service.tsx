import axiosInstance from '../utils/axiosInstance';

export const getPresignedUrl = async (fileName: string, fileType: string,folderUserId: string) => {
  const response = await axiosInstance.post('/user/presigned-url', {
    fileName,
    fileType,
    folderUserId,
  });
  return response.data.presignedUrl;
};

export const uploadFileToS3 = async (presignedUrl: string, file: File) => {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
};

export const downloadFileFromS3 = async (id: string) => {
  const response = await axiosInstance.get(`/user/download/cv/${id}`);
  return response.data;
};

