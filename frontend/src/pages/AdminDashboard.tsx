import { useQuery } from '@tanstack/react-query';
import { Button, Col, Input, message, Row, Space, Typography } from 'antd';
import { useState } from 'react';
import JobFormModal from '../components/JobFormModal';
import JobTable from '../components/JobTable';
import UserFormModal from '../components/UserFormModal';
import UserTable from '../components/userTable';
import { useAuth } from '../context/AuthContext';
import { Job } from '../interface/job.interface';
import { UserData } from '../interface/user.interface';
import { deleteJob, getAllJobs } from '../services/job.service';
import { FileType, getFileUrl } from '../services/upload.service';
import { deleteUser, getAllUsers } from '../services/user.service';
const { Title } = Typography;
const { Search } = Input;

const AdminDashboard = () => {
	const [isUserModalVisible, setIsUserModalVisible] = useState(false);
	const [isJobModalVisible, setIsJobModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserData | undefined>();
	const [selectedJob, setSelectedJob] = useState<Job | undefined>();
	const [userSearchText, setUserSearchText] = useState('');
	const [jobSearchText, setJobSearchText] = useState('');
	const { user } = useAuth();

	const { data: users, isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
		queryKey: ['users'],
		queryFn: getAllUsers
	});

	const { data: jobs, isLoading: isLoadingJobs, refetch: refetchJobs } = useQuery({
		queryKey: ['jobs'],
		queryFn: () => getAllJobs({ page: 1, size: 10 })
	});

	const filteredUsers = (users || []).filter((user: any) => 
		user.first_name?.toLowerCase().includes(userSearchText.toLowerCase()) ||
		user.last_name?.toLowerCase().includes(userSearchText.toLowerCase()) ||
		user.email?.toLowerCase().includes(userSearchText.toLowerCase())
	);

	const filteredJobs = (jobs?.results || []).filter((job: any) =>
		job.name?.toLowerCase().includes(jobSearchText.toLowerCase()) ||
		job.description?.toLowerCase().includes(jobSearchText.toLowerCase())
	);

	const handleAddUser = () => {
		setSelectedUser(undefined);
		setIsUserModalVisible(true);
	};

	const handleEditUser = (user: UserData) => {
		setSelectedUser(user);
		setIsUserModalVisible(true);
	};

	const handleEditJob = (job: Job) => {
		setSelectedJob(job);
		setIsJobModalVisible(true);
	};

	const handleDeleteUser = async (userId: string) => {
		try {
			await deleteUser(userId);
			message.success('User deleted successfully');
			refetchUsers();
		} catch (error) {
			message.error('Failed to delete user');
		}
	};

	const handleDeleteJob = async (jobId: string) => {
		try {
			await deleteJob(jobId);
			message.success('Job deleted successfully');
			refetchJobs();
		} catch (error) {
			message.error('Failed to delete job');
		}
	};

		const handleDownloadCv = async (id: string) => {
		try {
			const presignedUrl = await getFileUrl(id, 'cv', FileType.CV);
			window.open(presignedUrl, '_blank');
		} catch (error) {
			console.error('Failed to download CV:', error);
		}
	};

	return (
			<div >
				<Row justify="space-between" align="middle" style={{marginBottom:"20px"}} >
					<Col>
						<Title level={2} style={{ margin: 0 }}>Gestion des Utilisateurs</Title>
					</Col>
					<Col>
						<Space>
							<Button type="primary" onClick={handleAddUser}>Add User</Button>
							<Search
								placeholder="Rechercher un utilisateur..."
								style={{ width: 300 }}
								onChange={e => setUserSearchText(e.target.value)}
							/>
						</Space>
					</Col>
				</Row>
				<UserTable
					mode="candidate"
					currentUserId={user?.id || ''}
					canEdit={true}
					canDelete={true}
					users={filteredUsers}
					isLoading={isLoadingUsers}
					onEdit={handleEditUser}
					onDelete={handleDeleteUser}
					onDownloadCv={handleDownloadCv}
				/>

		
				<Row justify="space-between" align="middle" style={{marginBottom:"20px"}} >
					<Col>
						<Title level={2} style={{ margin: 0 }}>Gestion des Offres d'Emploi</Title>
					</Col>
					<Col>
						<Space>
							<Button type="primary" onClick={() => setIsJobModalVisible(true)}>Add Job</Button>
							<Search
								placeholder="Rechercher une offre..."
								style={{ width: 300 }}
								onChange={e => setJobSearchText(e.target.value)}
							/>
						</Space>
					</Col>
				</Row>
				<JobTable
					jobs={filteredJobs}
					isLoading={isLoadingJobs}
					onEdit={handleEditJob}
					onDelete={handleDeleteJob}
					canEdit={user?.role === 'admin'}
					canDelete={user?.role === 'admin'}
				/>

			<UserFormModal
				isVisible={isUserModalVisible}
				onClose={() => {
					setIsUserModalVisible(false);
					setSelectedUser(undefined);
				}}
				initialData={selectedUser}
				onSuccess={refetchUsers}
			/>

			<JobFormModal
				isVisible={isJobModalVisible}
				onClose={() => {
					setIsJobModalVisible(false);
					setSelectedJob(undefined);
				}}
				initialData={selectedJob}
				onSuccess={refetchJobs}
			/>
		</div>
	);
};

export default AdminDashboard;
