import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setSearchAdminJobByText } from "@/redux/jobSlice";
import AdminJobsTable from "./AdminJobsTable";
import useGetAdminJobs from "@/customHooks/useGetAdminJobs";
import getCurrentTime from "@/utilis/currentTime";
import { LuPlus, LuSearch, LuBriefcase } from "react-icons/lu";

function AdminJobs() {
  useGetAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchAdminJobByText(input));
  }, [input, dispatch]);

  const { user } = useSelector((store) => store.auth);

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <LuBriefcase className="size-5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Your Job Listings
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Good {getCurrentTime()}, {user.fullName}! Manage your posted jobs
            here.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
          <div className="relative flex-1 max-w-xs">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-10 w-full"
              placeholder="Search jobs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button
            className="cursor-pointer gap-2 w-full sm:w-auto"
            onClick={() => navigate("/admin/jobs/create")}
          >
            <LuPlus className="size-4" />
            Post New Job
          </Button>
        </div>

        {/* Table */}
        <AdminJobsTable />
      </div>
    </div>
  );
}

export default AdminJobs;
