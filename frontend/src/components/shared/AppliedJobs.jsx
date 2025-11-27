import { Badge } from "../ui/badge";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";

function AppliedJobs() {
  // const token = localStorage.getItem("token");
  // axios.defaults.headers.common["Authorization"] = `${token}`;
  // useEffect(async () => {
  //   // Fetch applied jobs from API when component mounts
  //   try {
  //     const response = await axios.get(`${APPLICATION_API_END_POINT}/my`);
  //     if (response.status === 200) {
  //       console.log("Applied Jobs:", response.data.applications);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error fetching applied jobs:",
  //       error?.response?.data?.message || error.message || error
  //     );
  //   }
  // }, []);

  const appliedJobs = [
    {
      dateApplied: "2024-06-01",
      jobTitle: "Frontend Developer",
      company: "Tech Solutions",
      status: "Pending",
    },
    {
      dateApplied: "2024-05-28",
      jobTitle: "Backend Developer",
      company: "Innovatech",
      status: "Accepted",
    },
    {
      dateApplied: "2024-05-20",
      jobTitle: "Full Stack Developer",
      company: "DevWorks",
      status: "Rejected",
    },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      default:
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    }
  };

  return (
    <div className="w-full border border-border bg-accent rounded-lg mt-4 px-4 py-4 md:px-8">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date Applied</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {appliedJobs.map((job, index) => (
              <TableRow key={index}>
                <TableCell>{job.dateApplied}</TableCell>
                <TableCell>{job.jobTitle}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell className="text-right">
                  <Badge className={getStatusStyles(job.status)}>
                    {job.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AppliedJobs;
