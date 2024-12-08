import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import JobTable from "../component/JobTable";
import { UseAuthContext } from "../context/AuthContext";
import { getAllJobs } from "../services/job.service";

const Dashboard = () => {
	const { user } = useContext(UseAuthContext);

	const { data: jobs, isLoading: isLoadingJobs, refetch: refetchJobs } = useQuery({
		queryKey: ['jobs'],
		queryFn: getAllJobs
	});
	if (isLoadingJobs) {
		return <>Loading</>
	}
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
			<JobTable
				jobs={jobs || []}
				canEdit={user?.role === 'admin' || user?.role === 'manager'}
				canDelete={user?.role === 'admin'}
			/>
		</div>
	);
}

export default Dashboard;