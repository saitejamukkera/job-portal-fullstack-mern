import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { capitalizeEachWord } from "@/utilis/CapitalizeEachWord";
import { APPLICATION_API_END_POINT } from "@/utilis/const_endpoints";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { updateApplicantStatus } from "@/redux/applicationSlice";

function ApplicantsTable() {
  const { applicants } = useSelector((store) => store.application);
  const dispatch = useDispatch();
  const shortListingStatus = ["Accept", "Reject", "In Review"];
  const [openPopoverId, setOpenPopoverId] = useState(null);

  async function shortListingStatusHandler(applicationId, status) {
    try {
      //   if (status === "Accept") {
      //     status = "accepted";
      //   } else if (status === "Reject") {
      //     status = "rejected";
      //   } else {
      //     status = "pending";
      //   }

      status =
        status === "Accept"
          ? "accepted"
          : status === "Reject"
          ? "rejected"
          : "pending";

      // Update application status (accept/reject/pending)
      const response = await axios.patch(
        `${APPLICATION_API_END_POINT}/status/${applicationId}`,
        { status },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(updateApplicantStatus({ applicationId, status }));
        toast.success(
          `Status updated to ${capitalizeEachWord(
            status
          )} successfully for the applicant.`
        );
      }
    } catch (error) {
      console.error("Error updating shortlisting status:", error);
      toast.error(error?.response?.data?.message || "Failed to update status.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 border border-border rounded-2xl shadow-sm p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date Appplied On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Status Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.length > 0 ? (
            applicants.map((applicant) => (
              <TableRow key={applicant._id}>
                <TableCell>{applicant?.applicant?.fullName}</TableCell>
                <TableCell>{applicant?.applicant?.email}</TableCell>
                <TableCell>
                  {applicant?.applicant?.phoneNumber || "N/A"}
                </TableCell>
                <TableCell>
                  {applicant?.applicant?.profile?.resumeURL ? (
                    <Link
                      to={applicant?.applicant?.profile?.resumeURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:decoration-blue-500 text-blue-600 cursor-pointer"
                    >
                      {applicant?.applicant?.profile?.resumeOriginalName ||
                        "Resume"}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground cursor-default">
                      N/A
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(applicant?.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className={
                    applicant?.status === "accepted"
                      ? "text-green-600 font-medium"
                      : applicant?.status === "rejected"
                      ? "text-red-600 font-medium"
                      : "text-yellow-600 font-medium"
                  }
                >
                  {capitalizeEachWord(applicant?.status || "N/A")}
                </TableCell>
                <TableCell className="text-right">
                  <Popover
                    open={openPopoverId === applicant._id}
                    onOpenChange={(isOpen) =>
                      setOpenPopoverId(isOpen ? applicant._id : null)
                    }
                  >
                    <PopoverTrigger className="cursor-pointer">
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-30 flex flex-col gap-2 p-2">
                      {shortListingStatus.map((status, index) => {
                        return (
                          <div
                            onClick={() => {
                              shortListingStatusHandler(applicant?._id, status);
                              setOpenPopoverId(null);
                            }}
                            key={index}
                            className={`cursor-pointer px-2 py-1 text-sm font-medium ${
                              status === "Accept"
                                ? "text-green-600 hover:bg-green-100 rounded"
                                : status === "Reject"
                                ? "text-red-600 hover:bg-red-100 rounded"
                                : "text-yellow-600 hover:bg-yellow-100 rounded"
                            }`}
                          >
                            {capitalizeEachWord(status)}
                          </div>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                No applicants found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ApplicantsTable;
