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
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	
	const hasJobPermission = (action: 'read' | 'create' | 'edit' | 'delete'): boolean => {
		return user?.permissions?.some(
			perm => perm.domain === 'Job' && perm[`can_${action}`]
		) ?? false;
	};

	const hasUserPermission = (action: 'read' | 'create' | 'edit' | 'delete'): boolean => {
		return user?.permissions?.some(
			perm => perm.domain === 'User' && perm[`can_${action}`]
		) ?? false;
	};

	const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
		queryKey: ['jobs', currentPage, pageSize],
		queryFn: () => getAllJobs({ page: currentPage, size: pageSize }),
		enabled: hasJobPermission('read')
	});

	const { data: users, isLoading: isLoadingUsers } = useQuery({
		queryKey: ['users'],
		queryFn: getAllUsers,
		enabled: hasUserPermission('read'),
		select: (data) => data.filter((user: any) => user.role === 'candidate')
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

	const handleDeleteJob = async (jobId: string) => {
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

	const handleDeleteUser = async (userId: string) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
			await deleteUserMutation.mutateAsync(userId);
		}
	};

	const filteredJobs = jobsData?.results?.filter((job: Job) =>
		job.name.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
		job.description.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
		job.company_name.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
		job.city.toLowerCase().includes(jobSearchTerm.toLowerCase())
	);

	const filteredUsers = users?.filter((user: any) =>
		user.first_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
		user.last_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
		user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
	);

	const handleDownloadCv = async (id: string) => {
		try {
			const presignedUrl = await getFileUrl(id, 'cv', FileType.CV);
			window.open(presignedUrl, '_blank');
		} catch (error) {
			message.error('Erreur lors du téléchargement du CV');
		}
	};

	if (isLoadingJobs) {
		return <>Loading</>;
	}

	return (
		<div className="p-4">
			<Space direction="vertical" size="large" style={{ width: '100%' }}>
				{hasJobPermission('read') && (
					<div>
						<Title level={2}>Jobs Referral</Title>
						<Row gutter={16} style={{ marginBottom: 16 }}>
							<Col flex="auto">
								<Search
									placeholder="Search a job..."
									allowClear
									enterButton
									style={{ width: '100%' }}
									onChange={(e) => setJobSearchTerm(e.target.value)}
								/>
							</Col>
							{hasJobPermission('create') && (
								<Col flex="none">
									<Button
										type="primary"
										icon={<PlusOutlined />}
										onClick={() => setIsJobModalVisible(true)}
									>
										Add a job
									</Button>
								</Col>
							)}
						</Row>
						<JobTable
							jobs={filteredJobs || []}
							canEdit={hasJobPermission('edit')}
							canDelete={hasJobPermission('delete')}
							currentUserId={user?.id}
							onEdit={handleEditJob}
							onDelete={handleDeleteJob}
							pagination={{
								current: currentPage,
								pageSize: pageSize,
								total: jobsData?.pagination.total || 0,
								onChange: (page, size) => {
									setCurrentPage(page);
									setPageSize(size);
								},
								showSizeChanger: true,
								showTotal: (total) => `Total ${total} items`
							}}
						/>
					</div>
				)}

				{hasUserPermission('read') && (
					<div>
						<Title level={2}>Candidates</Title>
						<Row gutter={16} style={{ marginBottom: 16 }}>
							<Col flex="auto">
								<Search
									placeholder="Search a candidate..."
									allowClear
									enterButton
									style={{ width: '100%' }}
									onChange={(e) => setUserSearchTerm(e.target.value)}
								/>
							</Col>
							{hasUserPermission('create') && (
								<Col flex="none">
									<Button
										type="primary"
										icon={<PlusOutlined />}
										onClick={() => setIsUserModalVisible(true)}
									>
										Add a candidate
									</Button>
								</Col>
							)}
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
					onSuccess={() => { }}
				/>
			)}
		</div>
	);
};

export default Dashboard;