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
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner className="mr-2" />
        <span className="text-lg font-medium">Loading job details...</span>
      </div>
    );
  }

  async function handleApplyJob() {
    try {
      const response = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${job._id}`
      );

      if (response.status === 201) {
        setIsApplied(true); //update apply now button immediately after successful application
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
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-bold text-2xl">{job?.title}</h1>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge
              variant="secondary"
              className="text-blue-700 dark:text-blue-300 font-medium"
            >
              {capitalizeEachWord(job?.jobType)}
            </Badge>

            <Badge variant="secondary" className="text-[#F83002] font-medium">
              {job?.vacancies} Vacancies
            </Badge>

            <Badge
              variant="secondary"
              className="text-[#7209b7] dark:text-purple-300 font-medium"
            >
              ${job?.salary} / Year
            </Badge>
          </div>
        </div>

        <Button
          disabled={isApplied}
          className="cursor-pointer"
          onClick={handleApplyJob}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="border-b border-border font-medium py-4 mt-6">
        {job?.description}
      </h1>

      <div className="my-4 flex flex-col gap-2 text-base">
        <p>
          <span className="font-semibold">Role:</span>{" "}
          {capitalizeEachWordPreservingDelimiters(job?.title)}
        </p>

        <p>
          <span className="font-semibold">Location:</span>{" "}
          {capitalizeEachWordPreservingDelimiters(job?.location)}
        </p>

        <p>
          <span className="font-semibold">Description:</span>{" "}
          {capitalizeEachWordPreservingDelimiters(job?.description)}
        </p>

        <p>
          <span className="font-semibold">Experience:</span>{" "}
          {capitalizeEachWord(job?.jobType)}
        </p>

        <p>
          <span className="font-semibold">Salary:</span> ${job?.salary} / Year
        </p>

        <p>
          <span className="font-semibold">Total Applicants:</span>{" "}
          {job?.applications?.length}
        </p>

        <p>
          <span className="font-semibold">Posted Date:</span>{" "}
          {new Date(job?.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default JobDescription;
