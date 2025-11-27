import { useSelector } from "react-redux";
import LatestJobCard from "./LatestJobCard";

function LatestJobs() {
  const { jobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto my-16 px-4">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        Latest & Top <span className="text-[#6A38C2]">Job Openings</span>
      </h1>

      {/* Job Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {jobs.length > 0 ? (
          jobs.map((job) => <LatestJobCard key={job._id} job={job} />)
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No jobs available
          </p>
        )}
      </div>
    </div>
  );
}

export default LatestJobs;
