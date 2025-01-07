import { DownloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Button, Col, Row, Space, Tag, Typography, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import SkillCard from '../components/SkillCard';
import { Skill } from '../interface/skill.interface';
import { UserData } from '../interface/user.interface';

import LinksDisplay from '../components/LinksDisplay';
import ProfileSection from '../components/ProfileSection';
import UserForm from '../components/UserForm';
import { useAuth } from '../context/AuthContext';
import { FileType, getFileUrl } from '../services/upload.service';
import { GetUserById } from '../services/user.service';

const { Title, Text } = Typography;

const PersonalInfoDisplay = ({ userData }: { userData: UserData }) => {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const { user } = useAuth();
	useEffect(() => {
		const loadProfilePicture = async () => {
			if (userData?.profilePicture && userData?.id) {
				const url = await getFileUrl(
					userData.id.toString(),
					userData.profilePicture,
					FileType.PROFILE_PICTURE
				);
				if (url) {
					setImageUrl(url);
				}
			}
		};
		loadProfilePicture();
	}, [userData?.profilePicture, userData?.id]);

	return (
		<div style={{ textAlign: 'center' }}>
			<Avatar size={200} src={imageUrl} style={{ marginBottom: '20px' }} />
			<Title level={2}>{userData?.first_name} {userData?.last_name}</Title>
			<Title level={4}> {userData?.years_of_experience && `${userData?.years_of_experience} years of experience`}</Title>
			<Text type="secondary">{userData?.desired_position}</Text>
			<div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
				{user?.role && <Text><Tag color="blue">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</Tag></Text>}
				{userData?.role && <Text>Expected Salary: {userData?.salary_expectation}€</Text>}
				{userData?.current_position && <Text>Current Position: {userData?.current_position}</Text>}
				{userData?.current_company && <Text>Current Company: {userData?.current_company}</Text>}
			</div>
		</div>
	);
};

// frontend/src/components/profile/DocumentsDisplay.tsx
const DocumentsDisplay = ({ userData, onDownloadCv }: { userData: UserData; onDownloadCv: () => void }) => (
	<Space direction="vertical" size="large" style={{ width: '100%' }}>
		<Button type="primary" onClick={onDownloadCv} icon={<DownloadOutlined />} block>
			Download CV
		</Button>
		{userData?.cv && (
			<Text type="secondary">Current CV : {userData.cv}</Text>
		)}
	</Space>
);

// frontend/src/components/profile/SkillsDisplay.tsx
const SkillsDisplay = ({ skills }: { skills: Skill[] }) => (
	<Row gutter={[16, 16]}>
		{skills?.map((skill, index) => (
			<Col xs={24} sm={12} md={8} lg={6} key={index}>
				<SkillCard skill={skill} />
			</Col>
		))}
	</Row>
);

const Profile = () => {
	const { user } = useAuth();
	const [editingSection, setEditingSection] = useState<'personal' | 'skills' | 'documents' | 'links' | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const formRef = useRef<any>();
	const { data: userData, isLoading, refetch } = useQuery({
		queryKey: ['user', user?.id],
		queryFn: () => GetUserById(user?.id),
		enabled: !!user?.id,
	});

	const handleSectionEdit = (section: 'personal' | 'skills' | 'documents' | 'links') => {
		setEditingSection(section);
	};

	const handleUpdateSuccess = () => {
		refetch();
		setEditingSection(null);
	};

	const handleCancel = () => {
		setEditingSection(null);
	};

	const handleValidate = () => {
		formRef.current?.submit();
	};

	const renderEditActions = () => (
		<Space>
			<Button onClick={handleCancel}>
				Cancel
			</Button>
			<Button
				type="primary"
				onClick={handleValidate}
				loading={isUploading}
			>
				Validate
			</Button>
		</Space>
	);

	const downloadCv = async () => {
		if (userData?.cv) {
			try {
				const presignedUrl = await getFileUrl(
					userData.id.toString(),
					userData.cv,
					FileType.CV
				);
				window.open(presignedUrl, '_blank');
				message.success('CV downloaded successfully');
			} catch (error) {
				message.error('Error during CV download');
			}
		}
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<div style={{ padding: '24px' }}>
			<Row gutter={[24, 24]}>
				<Col xs={24} md={8}>
					<ProfileSection
						title="Personal informations"
						onEdit={() => handleSectionEdit('personal')}
						extra={editingSection === 'personal' && renderEditActions()}
					>
						{editingSection === 'personal' ? (
							<UserForm
								ref={formRef}
								initialData={userData}
								onSuccess={handleUpdateSuccess}
								onClose={handleCancel}
								setUploading={setIsUploading}
								partialForm="personal"
							/>
						) : (
							<PersonalInfoDisplay userData={userData} />
						)}
					</ProfileSection>
				</Col>

				<Col xs={24} md={16}>
					<Space direction="vertical" style={{ width: '100%' }} size="large">
						<ProfileSection
							title="Documents"
							onEdit={() => handleSectionEdit('documents')}
							extra={editingSection === 'documents' && renderEditActions()}
						>
							{editingSection === 'documents' ? (
								<UserForm
									ref={formRef}
									initialData={userData}
									onSuccess={handleUpdateSuccess}
									onClose={handleCancel}
									setUploading={setIsUploading}
									partialForm="documents"
								/>
							) : (
								<DocumentsDisplay userData={userData} onDownloadCv={downloadCv} />
							)}
						</ProfileSection>

						<ProfileSection
							title="Links"
							onEdit={() => handleSectionEdit('links')}
							extra={editingSection === 'links' && renderEditActions()}
						>
							{editingSection === 'links' ? (
								<UserForm
									ref={formRef}
									initialData={userData}
									onSuccess={handleUpdateSuccess}
									onClose={handleCancel}
									setUploading={setIsUploading}
									partialForm="links"
								/>
							) : (
								<LinksDisplay userData={userData} />
							)}
						</ProfileSection>

						<ProfileSection
							title="Skills"
							onEdit={() => handleSectionEdit('skills')}
							extra={editingSection === 'skills' && renderEditActions()}
						>
							{editingSection === 'skills' ? (
								<UserForm
									ref={formRef}
									initialData={userData}
									onSuccess={handleUpdateSuccess}
									onClose={handleCancel}
									setUploading={setIsUploading}
									partialForm="skills"
								/>
							) : (
								<SkillsDisplay skills={userData?.skills} />
							)}
						</ProfileSection>
					</Space>
				</Col>
			</Row>
		</div>
	);
};

export default Profile;