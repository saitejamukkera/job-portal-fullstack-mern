import { Badge } from "../ui/badge";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";
import useGetAppliedJobs from "@/customHooks/useGetAppliedJobs";
import { capitalizeEachWord } from "@/utilis/CapitalizeEachWord";

function AppliedJobs() {
  const { appliedJobs, loading, error } = useGetAppliedJobs();

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      default:
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    }
  };

  if (loading) {
    return (
      <div className="w-full border border-border bg-accent rounded-lg mt-4 px-4 py-8 text-center">
        Loading applied jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full border border-border bg-accent rounded-lg mt-4 px-4 py-8 text-center text-red-500">
        Error loading applied jobs.
      </div>
    );
  }

  if (!appliedJobs || appliedJobs.length === 0) {
    return (
      <div className="w-full border border-border bg-accent rounded-lg mt-4 px-4 py-8 text-center text-muted-foreground">
        No applied jobs found.
      </div>
    );
  }

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
            {appliedJobs.map((application) => (
              <TableRow key={application._id}>
                <TableCell>
                  {new Date(application.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{application.job?.title || "N/A"}</TableCell>
                <TableCell>
                  {application.job?.company?.companyName || "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={getStatusStyles(application.status)}>
                    {capitalizeEachWord(application.status) || "Pending"}
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
