import { useParams } from "react-router-dom";
import useGetSingleJob from "../../customHooks/useGetSingleJob";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  capitalizeEachWord,
  capitalizeEachWordPreservingDelimiters,
} from "@/utilis/CapitalizeEachWord";
import { APPLICATION_API_END_POINT } from "@/utilis/const_endpoints";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { setJob } from "@/redux/jobSlice";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  LuMapPin,
  LuBriefcase,
  LuDollarSign,
  LuUsers,
  LuCalendar,
  LuCircleCheck,
} from "react-icons/lu";

function JobDescription() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `${token}`;

  const { id } = useParams();

  const { loading } = useGetSingleJob(id);

  const { job } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (!job || !user) return;

    const applied = job?.applications?.some(
      (application) => application.applicant?._id?.toString() === user?._id
    );

    setIsApplied(applied);
  }, [job, user]);

  // Loader
  if (loading || !job) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <Spinner className="size-8" />
        <span className="text-lg font-medium text-muted-foreground">
          Loading job details...
        </span>
      </div>
    );
  }

  async function handleApplyJob() {
    try {
      const response = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${job._id}`
      );

      if (response.status === 201) {
        setIsApplied(true);
        dispatch(setJob(response.data.job));
        toast.success("Successfully applied for the job");
      }
    } catch (error) {
      console.error("Error applying for job:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || "Failed to apply for the job"
      );
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-6 sm:my-10 px-4">
      {/* Header Card */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Company Logo */}
          <Avatar className="size-14 sm:size-16 rounded-xl shadow-md border border-border">
            <AvatarImage
              src={job?.company?.logoURL || "https://via.placeholder.com/64"}
              alt={job?.company?.companyName}
            />
          </Avatar>

          {/* Job Info */}
          <div className="flex-1">
            <h1 className="font-bold text-xl sm:text-2xl text-foreground">
              {job?.title}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {capitalizeEachWordPreservingDelimiters(
                job?.company?.companyName
              )}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge
                variant="secondary"
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                {capitalizeEachWord(job?.jobType)}
              </Badge>

              <Badge
                variant="secondary"
                className="text-orange-600 dark:text-orange-400 font-medium"
              >
                {job?.vacancies} Vacancies
              </Badge>

              <Badge
                variant="secondary"
                className="text-purple-600 dark:text-purple-400 font-medium"
              >
                ${job?.salary?.toLocaleString()} / yr
              </Badge>
            </div>
          </div>

          {/* Apply Button */}
          <div className="sm:ml-auto">
            <Button
              disabled={isApplied || !user || user?.role !== "applicant"}
              className={`
                w-full sm:w-auto cursor-pointer h-11 px-6 font-medium
                ${
                  isApplied
                    ? "bg-green-600 hover:bg-green-600 text-white"
                    : "bg-[#6A38C2] hover:bg-[#5b2eb0]"
                }
              `}
              onClick={handleApplyJob}
            >
              {isApplied ? (
                <>
                  <LuCircleCheck className="size-4 mr-2" />
                  Applied
                </>
              ) : (
                "Apply Now"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-6 bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          About this role
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {job?.description}
        </p>
      </div>

      {/* Details Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Location */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <LuMapPin className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium text-foreground">
                {capitalizeEachWordPreservingDelimiters(job?.location)}
              </p>
            </div>
          </div>
        </div>

        {/* Job Type */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <LuBriefcase className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Job Type</p>
              <p className="font-medium text-foreground">
                {capitalizeEachWord(job?.jobType)}
              </p>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <LuDollarSign className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Salary</p>
              <p className="font-medium text-foreground">
                ${job?.salary?.toLocaleString()} / year
              </p>
            </div>
          </div>
        </div>

        {/* Applicants */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <LuUsers className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Applicants</p>
              <p className="font-medium text-foreground">
                {job?.applications?.length} applied
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      {job?.requirements?.length > 0 && (
        <div className="mt-6 bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Requirements
          </h2>
          <ul className="space-y-2">
            {job?.requirements?.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Posted Date */}
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <LuCalendar className="size-4" />
        <span>
          Posted on{" "}
          {new Date(job?.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

export default JobDescription;
