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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, MoreHorizontal, TrashIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { JOB_API_END_POINT } from "@/utilis/const_endpoints";
import { setAdminJobs } from "@/redux/jobSlice";

function AdminJobsTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { adminJobs, searchAdminJobByText } = useSelector((store) => store.job);

  const [filteredJobs, setFilteredJobs] = useState(adminJobs);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtering logic
  useEffect(() => {
    const filtered = adminJobs.filter((job) => {
      if (!searchAdminJobByText) return true;

      return job.title
        ?.toLowerCase()
        .includes(searchAdminJobByText.toLowerCase());
    });

    setFilteredJobs(filtered);
  }, [adminJobs, searchAdminJobByText]);

  function openDialog(job) {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!jobToDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");

      const resp = await axios.delete(
        `${JOB_API_END_POINT}/${jobToDelete._id}`,
        { headers: { Authorization: token } }
      );

      if (resp.status === 200) {
        toast.success("Job deleted successfully");

        const updated = adminJobs.filter((j) => j._id !== jobToDelete._id);
        dispatch(setAdminJobs(updated));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 border border-border rounded-xl shadow-sm p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                No jobs found
              </TableCell>
            </TableRow>
          ) : (
            filteredJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company?.companyName || "N/A"}</TableCell>
                <TableCell>{job.jobType}</TableCell>
                <TableCell>
                  {new Date(job.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal className="cursor-pointer" />
                    </PopoverTrigger>

                    <PopoverContent className="w-32 p-2">
                      <div className="flex flex-col gap-3">
                        <div
                          onClick={() => navigate(`/admin/jobs/${job._id}`)}
                          className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        >
                          <Edit2 className="w-4" />
                          Edit
                        </div>

                        <div
                          onClick={() =>
                            navigate(`/admin/jobs/${job._id}/applicants`)
                          }
                          className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        >
                          <Eye className="w-4" />
                          Applicants
                        </div>

                        <div
                          onClick={() => openDialog(job)}
                          className="flex items-center gap-2 text-red-600 cursor-pointer hover:opacity-80"
                        >
                          <TrashIcon className="w-4" />
                          Delete
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription className="mt-2 leading-7 ">
              Are you sure you want to delete
              <span className="font-medium">{jobToDelete?.title}</span> job?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminJobsTable;
