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
import { Spinner } from "../ui/spinner";
import { LuBriefcase, LuCalendar, LuBuilding } from "react-icons/lu";
import { Link } from "react-router-dom";

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
      <div className="w-full border border-border bg-card rounded-xl p-8 text-center">
        <Spinner className="size-6 mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">Loading applied jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center">
        <p className="text-red-600 dark:text-red-400 text-sm">
          Error loading applied jobs.
        </p>
      </div>
    );
  }

  if (!appliedJobs || appliedJobs.length === 0) {
    return (
      <div className="w-full border border-border bg-card rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center size-12 rounded-full bg-muted mb-3">
          <LuBriefcase className="size-6 text-muted-foreground" />
        </div>
        <p className="text-foreground font-medium">No applications yet</p>
        <p className="text-muted-foreground text-sm mt-1">
          Start applying to jobs to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Cards View */}
      <div className="block sm:hidden space-y-3">
        {appliedJobs.map((application) => (
          <Link
            key={application._id}
            to={`/description/${application.job?._id}`}
            className="block border border-border bg-card rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-foreground truncate">
                  {application.job?.title || "N/A"}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <LuBuilding className="size-3 flex-shrink-0" />
                  {application.job?.company?.companyName || "N/A"}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <LuCalendar className="size-3 flex-shrink-0" />
                  {new Date(application.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Badge
                className={`${getStatusStyles(
                  application.status
                )} flex-shrink-0`}
              >
                {capitalizeEachWord(application.status) || "Pending"}
              </Badge>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block border border-border bg-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Date Applied</TableHead>
                <TableHead className="font-semibold">Job Title</TableHead>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="text-right font-semibold">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {appliedJobs.map((application) => (
                <TableRow key={application._id} className="hover:bg-muted/30">
                  <TableCell className="text-muted-foreground">
                    {new Date(application.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/description/${application.job?._id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {application.job?.title || "N/A"}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
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
    </div>
  );
}

export default AppliedJobs;
