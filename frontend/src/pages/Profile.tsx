import { useQuery } from '@tanstack/react-query';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { downloadFileFromS3, getPresignedUrl, uploadFileToS3 } from '../services/upload.service';
import { GetUserById, updateUser } from '../services/user.service';

const Profile = () => {
	const { user } = useAuth();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

	const { data: userData, isLoading, isError } = useQuery({
		queryKey: ['user', user?.id],
		queryFn: () => GetUserById(user?.id),
			enabled: !!user?.id,
	});

	useEffect(() => {
		if (userData && !userData.cv) {
			setIsModalVisible(true);
		}
	}, [userData]);

	const onDrop = (acceptedFiles: File[]) => {
		const file = acceptedFiles[0];

		getPresignedUrl(file.name, file.type, user?.id.toString() || "")
			.then(presignedUrlResponse => {
				return uploadFileToS3(presignedUrlResponse, file).then(() => presignedUrlResponse);
			})
			.then(() => {
				const updateUserDto = {
					cv: file.name,
				};
				return updateUser(user?.id, updateUserDto);
			})
			.then((updatedUserResponse) => {
				console.log('User updated successfully:', updatedUserResponse);
				setIsModalVisible(false);
			})
			.catch(error => {
				console.error('Error uploading file:', error);
			});
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setUploadedFiles([]);
	};

	const downloadCv = async () => {
		if (userData?.cv) {
			const presignedUrl = await downloadFileFromS3(userData.id.toString());
			window.open(presignedUrl, '_blank');
		}
	};

	if (!user) {
		return <p>Please log in to view your profile.</p>;
	}

	if (isLoading) return <p>Loading...</p>;

	if (isError) {
		return <p>Error fetching user data.</p>;
	}

	const fileName = userData?.cv;

	return (
		<div>
			<h1>Profile</h1>
			{fileName ? (
				<div>
					<p>Your CV: <button onClick={downloadCv}>Télécharger le CV</button></p>
				</div>
			) : (
				<p>No CV uploaded.</p>
			)}
			<Modal
				title="Upload Your CV"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
					<input {...getInputProps()} />
					<p>
						{uploadedFiles.length > 0
							? `Files ready to upload: ${uploadedFiles.map(file => file.name).join(', ')}`
							: "Drag 'n' drop some files here, or click to select files"}
					</p>
				</div>
			</Modal>
		</div>
	);
};

export default Profile;