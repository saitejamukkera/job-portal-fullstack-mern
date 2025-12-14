import { Button } from "../ui/button";
import { Bookmark, CheckCircle } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { LuMapPin } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import postedTime from "@/utilis/postedTime";
import {
  capitalizeEachWord,
  capitalizeEachWordPreservingDelimiters,
} from "@/utilis/CapitalizeEachWord";

function Job({ job }) {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs } = useSelector((store) => store.job);

  // Check if user has already applied to this job
  const isApplied = allAppliedJobs?.some(
    (application) => application?.job?._id === job?._id
  );

  return (
    <div className="h-full p-4 sm:p-5 rounded-xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Posted {postedTime(job?.createdAt)}
        </p>
        {isApplied ? (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 flex items-center gap-1 text-xs">
            <CheckCircle size={12} />
            Applied
          </Badge>
        ) : (
          <Button
            variant="outline"
            className="rounded-full cursor-pointer size-8 sm:size-9"
            size="icon"
          >
            <Bookmark className="size-4" />
          </Button>
        )}
      </div>

      {/* Company Section */}
      <div className="flex items-center gap-3 my-3">
        <Avatar className="shadow-sm rounded-lg size-10 sm:size-11 border border-border">
          <AvatarImage
            src={job?.company?.logoURL || "https://via.placeholder.com/40"}
            alt="Company Logo"
          />
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-sm sm:text-base text-foreground truncate group-hover:text-primary transition-colors">
            {job?.company?.companyName}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
            <LuMapPin className="size-3 flex-shrink-0" />
            <span className="truncate">{job?.location}</span>
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div>
        <h3 className="font-bold text-base sm:text-lg my-2 text-foreground line-clamp-1">
          {capitalizeEachWordPreservingDelimiters(job?.title)}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {capitalizeEachWordPreservingDelimiters(job?.description)}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <Badge
          variant="secondary"
          className="text-blue-600 dark:text-blue-400 font-medium text-[10px] sm:text-xs px-2 py-0.5"
        >
          {capitalizeEachWord(job?.jobType)}
        </Badge>
        <Badge
          variant="secondary"
          className="text-orange-600 dark:text-orange-400 font-medium text-[10px] sm:text-xs px-2 py-0.5"
        >
          {job?.vacancies} Openings
        </Badge>
        <Badge
          variant="secondary"
          className="text-purple-600 dark:text-purple-400 font-medium text-[10px] sm:text-xs px-2 py-0.5"
        >
          ${job?.salary?.toLocaleString()}/yr
        </Badge>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          className="cursor-pointer flex-1 h-9 sm:h-10 text-xs sm:text-sm"
          onClick={() => navigate(`/description/${job._id}`)}
        >
          Details
        </Button>

        {user && user.role === "applicant" && !isApplied && (
          <Button
            className="cursor-pointer flex-1 h-9 sm:h-10 text-xs sm:text-sm bg-[#6A38C2] hover:bg-[#5b2eb0] dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
            onClick={() => navigate(`/description/${job._id}`)}
          >
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
}

export default Job;
