import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Input, message, Row, Space, Typography } from "antd";
import { useState } from "react";
import JobOfferModal from "../components/JobOfferModal";
import JobTable from "../components/JobTable";
import UserFormModal from "../components/UserFormModal";
import UserTable from "../components/userTable";
import { useAuth } from "../context/AuthContext";
import PermissionGuard from "../guards/PermissionGuard";
import { Job } from "../interface/job.interface";
import { UserData } from "../interface/user.interface";
import { deleteJob, getAllJobs } from "../services/job.service";
import { FileType, getFileUrl } from '../services/upload.service';
import { deleteUser, getAllPublishers, getAllUsers } from "../services/user.service";
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

	

	const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
		queryKey: ['jobs', currentPage, pageSize],
		queryFn: () => getAllJobs({ page: currentPage, size: pageSize }),
		//enabled: user?.permissions?.includes('read:job')
	});

	const { data: users, isLoading: isLoadingUsers } = useQuery({
		queryKey: ['users'],
		queryFn: getAllUsers,
		//enabled: user?.permissions?.includes('read:user'),
		//select: (data) => data.filter((user: any) => user.role === 'candidate')
	});

	const { data: alumni, isLoading: isLoadingAlumni } = useQuery({
		queryKey: ['alumni'],
		queryFn: getAllPublishers,
		//enabled: user?.permissions?.includes('read:publisher'),
		//select: (data) => data.filter((user: any) => user.role === 'candidate')
	});

	const deleteJobMutation = useMutation({
		mutationFn: deleteJob,
		onSuccess: () => {
			message.success('Job deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['jobs'] });
		},
		onError: () => {
			message.error('Error during deletion');
		}
	});

	const deleteUserMutation = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			message.success('User deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: () => {
			message.error('Error during deletion');
		}
	});

	const handleEditJob = (job: Job) => {
		setSelectedJob(job);
		setIsJobModalVisible(true);
	};

	const handleDeleteJob = async (jobId: string) => {
		if (window.confirm('Are you sure you want to delete this job ?')) {
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
		if (window.confirm('Are you sure you want to delete this user ?')) {
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
			message.error('Error downloading CV');
		}
	};

	if (isLoadingJobs) {
		return <>Loading</>;
	}

	return (
		<div className="p-4">
			<Space direction="vertical" size="large" style={{ width: '100%' }}>
				<PermissionGuard domain="Job" action="read">
					<div>
						<Title level={2}>Jobs Referral</Title>
						<Row gutter={16} style={{ marginBottom: 16 }}>
							<Col span={18}>
								<Search
									placeholder="Search a job..."
									allowClear
									enterButton
									onChange={(e) => setJobSearchTerm(e.target.value)}
								/>
							</Col>
							<Col span={6}>
								<Button
									type="primary"
									icon={<PlusOutlined />}
									onClick={() => setIsJobModalVisible(true)}
								>
									Add
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
				</PermissionGuard>

				<PermissionGuard domain="User" action="create">
					<div>
						<Title level={2}>Candidates</Title>
						<Row gutter={16} style={{ marginBottom: 16 }}>
							<Col span={18}>
								<Search
									placeholder="Search a candidate..."
									allowClear
									enterButton
									style={{ width: '100%' }}
									onChange={(e) => setUserSearchTerm(e.target.value)}
								/>
							</Col>
							<Col span={6}>
								<Button
									type="primary"
									icon={<PlusOutlined />}
									onClick={() => setIsUserModalVisible(true)}
									>
										Add
									</Button>
								</Col>
						</Row>
						<UserTable
							mode="candidate"
							users={filteredUsers || []}
							isLoading={isLoadingUsers}
							canEdit={true}
							canDelete={true}
							currentUserId={user?.id || ''}
							onEdit={handleEditUser}
							onDelete={handleDeleteUser}
							onDownloadCv={handleDownloadCv}
						/>
					</div>
				</PermissionGuard>

				<PermissionGuard domain="User" action="read">
					<div>
						<Title level={2}>Alumni</Title>
						<Row gutter={16} style={{ marginBottom: 16 }}>
							<Col span={18}>
								<Search
									placeholder="Search a alumni..."
									allowClear
									enterButton
									style={{ width: '100%' }}
									onChange={(e) => setUserSearchTerm(e.target.value)}
								/>
							</Col>
							<Col span={6}>
								<Button
									type="primary"
										icon={<PlusOutlined />}
										onClick={() => setIsUserModalVisible(true)}
									>
										Add
									</Button>
								</Col>
						</Row>
						<UserTable
							currentUserId={user?.id || ''}
							canEdit={true}
							canDelete={true}
							mode="alumni"
							users={alumni || []}
							isLoading={isLoadingAlumni}
							onEdit={handleEditUser}
							onDelete={handleDeleteUser}
							onDownloadCv={handleDownloadCv}
						/>
					</div>
				</PermissionGuard>
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