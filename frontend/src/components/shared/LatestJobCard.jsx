import { Badge } from "@/components/ui/badge";
import {
  capitalizeEachWord,
  capitalizeEachWordPreservingDelimiters,
} from "../../utilis/CapitalizeEachWord";
import { Link } from "react-router-dom";

function LatestJobCard({ job }) {
  return (
    <Link to={`/description/${job._id}`} className="block group">
      <div className="h-full p-4 sm:p-5 rounded-xl border border-border bg-card hover:bg-accent/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group-hover:border-primary/30">
        {/* Company Info */}
        <div>
          <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
            {capitalizeEachWordPreservingDelimiters(job?.company?.companyName)}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            📍 {capitalizeEachWordPreservingDelimiters(job?.location)}
          </p>
        </div>

        {/* Job Title */}
        <div className="mt-3">
          <h4 className="text-lg sm:text-xl font-bold text-foreground line-clamp-1">
            {job?.title}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {job?.description}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4">
          <Badge
            variant="secondary"
            className="text-xs font-medium text-blue-600 dark:text-blue-400"
          >
            {capitalizeEachWord(job?.jobType)}
          </Badge>

          <Badge
            variant="secondary"
            className="text-xs text-[#F83002] dark:text-orange-400 font-semibold"
          >
            {job?.vacancies} Vacancies
          </Badge>

          <Badge
            variant="secondary"
            className="text-xs text-[#7209b7] dark:text-purple-400 font-semibold"
          >
            ${job?.salary?.toLocaleString()} / yr
          </Badge>
        </div>
      </div>
    </Link>
  );
}

export default LatestJobCard;
