import axiosInstance from "../utils/axiosInstance";

export enum FileType {
  CV = 'cv',
  PROFILE_PICTURE = 'profile-picture'
}

export const getPresignedUrl = async (userId: string, fileName: string, fileType: FileType) => {
  const response = await axiosInstance.post('/user/presigned-url', {
    folderUserId:userId,
    fileName,
    fileType,
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

export const extractCVData = async (userId: string, fileName: string) => {
  const response = await axiosInstance.post('/cv/extract', {
    userId,
    fileName,
  });
  return response.data;
};

export const getFileUrl = async (userId: string, fileName: string, fileType: FileType) => {
  const response = await axiosInstance.get(`/user/file/${userId}/${fileType}/${fileName}`);
  return response.data.url;
};