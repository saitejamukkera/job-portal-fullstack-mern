import { Badge } from "@/components/ui/badge";
import {
  capitalizeEachWord,
  capitalizeEachWordPreservingDelimiters,
} from "../../utilis/CapitalizeEachWord";

function LatestJobCard({ job }) {
  return (
    <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition cursor-pointer dark:border-gray-700">
      {/* Company Info */}
      <div>
        <h1 className="font-semibold text-lg text-foreground">
          {capitalizeEachWordPreservingDelimiters(job?.company?.companyName)}
        </h1>
        <p className="text-sm text-muted-foreground">
          {capitalizeEachWordPreservingDelimiters(job?.location)}
        </p>
      </div>

      {/* Job Title */}
      <div className="mt-3">
        <h1 className="text-xl font-bold text-foreground">{job?.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge variant="secondary" className="font-medium">
          {capitalizeEachWord(job?.jobType)}
        </Badge>

        <Badge variant="secondary" className="text-[#F83002] font-semibold">
          {job?.vacancies} Vacancies
        </Badge>

        <Badge variant="secondary" className="text-[#7209b7] font-semibold">
          ${job?.salary} / Year
        </Badge>
      </div>
    </div>
  );
}

export default LatestJobCard;
