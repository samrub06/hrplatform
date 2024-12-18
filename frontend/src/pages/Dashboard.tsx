import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Input, message, Row, Space, Typography } from "antd";
import { useState } from "react";
import JobOfferModal from "../components/JobOfferModal";
import JobTable from "../components/JobTable";
import UserFormModal from "../components/UserFormModal";
import UserTable from "../components/userTable";
import { useAuth } from "../context/AuthContext";
import { Job } from "../interface/job.interface";
import { UserData } from "../interface/user.interface";
import { deleteJob, getAllJobs } from "../services/job.service";
import { FileType, getFileUrl } from '../services/upload.service';
import { deleteUser, getAllUsers } from "../services/user.service";

const { Search } = Input;
const { Title } = Typography;

const Dashboard = () => {
	const { user } = useAuth();
	const [jobSearchTerm, setJobSearchTerm] = useState("");
	const [userSearchTerm, setUserSearchTerm] = useState("");
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
	const [isJobModalVisible, setIsJobModalVisible] = useState(false);
	const [isUserModalVisible, setIsUserModalVisible] = useState(false);
	const queryClient = useQueryClient();
	const { data: jobs, isLoading: isLoadingJobs } = useQuery({
		queryKey: ['jobs'],
		queryFn: getAllJobs
	});

	const { data: users, isLoading: isLoadingUsers } = useQuery({
		queryKey: ['users'],
		queryFn: getAllUsers,
		select: (data) => data.filter((user :any )=> user.role === 'candidate')
	});

	const deleteJobMutation = useMutation({
		mutationFn: deleteJob,
		onSuccess: () => {
			message.success('Job supprimé avec succès');
			queryClient.invalidateQueries({ queryKey: ['jobs'] });
		},
		onError: () => {
			message.error('Erreur lors de la suppression');
		}
	});

	const deleteUserMutation = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			message.success('Utilisateur supprimé avec succès');
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: () => {
			message.error('Erreur lors de la suppression');
		}
	});

	const handleEditJob = (job: Job) => {
		setSelectedJob(job);
		setIsJobModalVisible(true);
	};

	const handleDeleteJob = async (jobId: number) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
			await deleteJobMutation.mutateAsync(jobId);
		}
	};

	const handleModalClose = () => {
		setSelectedJob(null);
		setIsJobModalVisible(false);
	};

	const handleEditUser = (user: UserData) => {
		setSelectedUser(user);
		setIsUserModalVisible(true);
	};

	const handleDeleteUser = async (userId: number) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
			await deleteUserMutation.mutateAsync(userId);
		}
	};

	const filteredJobs = jobs?.filter(job => 
		job.name.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
		job.description.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
		job.company_name.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
		job.city.toLowerCase().includes(jobSearchTerm.toLowerCase())
	);

	const filteredUsers = users?.filter((user :any )=> 
		user.first_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
		user.last_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
		user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
	);

	const handleDownloadCv = async (id: number) => {
		try {
			const presignedUrl = await getFileUrl(id.toString(), 'cv', FileType.CV);
			window.open(presignedUrl, '_blank');
		} catch (error) {
			message.error('Erreur lors du téléchargement du CV');
		}
	};

	const canManageJobs = user?.role === 'publisher' || user?.role === 'admin';
	const canManageUsers = user?.role === 'admin';

	if (isLoadingJobs) {
		return <>Loading</>;
	}

	return (
		<div className="p-4">
			<Space direction="vertical" size="large" style={{ width: '100%' }}>
				{canManageJobs && (
					<div>
						<Title level={2}>Jobs Referral</Title>
						<Row gutter={16} style={{ marginBottom: 16 }}>
							<Col flex="auto">
								<Search
									placeholder="Rechercher un job..."
									allowClear
									enterButton
									style={{ width: '100%' }}
									onChange={(e) => setJobSearchTerm(e.target.value)}
								/>
							</Col>
							<Col flex="none">
								<Button 
									type="primary" 
									icon={<PlusOutlined />}
									onClick={() => setIsJobModalVisible(true)}
								>
									Ajouter une offre
								</Button>
							</Col>
						</Row>
						<JobTable
							jobs={filteredJobs || []}
							canEdit={true}
							canDelete={true}
							currentUserId={user?.id}
							onEdit={handleEditJob}
							onDelete={handleDeleteJob}
						/>
					</div>
				)}

				{canManageUsers && (
					<div>
						<Title level={2}>Candidats</Title>
						<Row gutter={16} style={{ marginBottom: 16 }}>
							<Col flex="auto">
								<Search
									placeholder="Rechercher un candidat..."
									allowClear
									enterButton
									style={{ width: '100%' }}
									onChange={(e) => setUserSearchTerm(e.target.value)}
								/>
							</Col>
							<Col flex="none">
								<Button 
									type="primary" 
									icon={<PlusOutlined />}
									onClick={() => setIsUserModalVisible(true)}
								>
									Add a candidate
								</Button>
							</Col>
						</Row>
						<UserTable
							users={filteredUsers || []}
							isLoading={isLoadingUsers}
							onEdit={handleEditUser}
							onDelete={handleDeleteUser}
							onDownloadCv={handleDownloadCv}
						/>
					</div>
				)}
			</Space>

			{/* Modals */}
			{isJobModalVisible && (
				<JobOfferModal
					isVisible={isJobModalVisible}
					onClose={handleModalClose}
					userId={user?.id || ''}
					initialData={selectedJob}
				/>
			)}

			{isUserModalVisible && (
				<UserFormModal
					isVisible={isUserModalVisible}
					onClose={() => {
						setIsUserModalVisible(false);
						setSelectedUser(null);
					}}
					initialData={selectedUser || null}
					onSuccess={() => {}}
				/>
			)}
		</div>
	);
};

export default Dashboard;