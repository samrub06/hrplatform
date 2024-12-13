import { useQuery } from "@tanstack/react-query";
import JobTable from "../component/JobTable";
import { useAuth } from "../context/AuthContext";
import { getAllJobs } from "../services/job.service";

const Dashboard = () => {
	const { user } = useAuth();

	const { data: jobs, isLoading: isLoadingJobs, refetch: refetchJobs } = useQuery({
		queryKey: ['jobs'],
		queryFn: getAllJobs
	});
	if (isLoadingJobs) {
		return <>Loading</>
	}
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Jobs</h1>
			<JobTable
				jobs={jobs || []}
				canEdit={user?.role === 'admin'}
				canDelete={user?.role === 'admin'}
			/>
		</div>
	);
}

export default Dashboard;