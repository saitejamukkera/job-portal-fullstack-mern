import { useSelector } from "react-redux";
import LatestJobCard from "./LatestJobCard";

function LatestJobs() {
  const { jobs } = useSelector((store) => store.job);

  return (
    <section className="max-w-7xl mx-auto my-12 sm:my-16 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center sm:text-left mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Latest & Top{" "}
          <span className="text-[#6A38C2] dark:text-purple-400">
            Job Openings
          </span>
        </h2>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Discover your next opportunity from our latest listings
        </p>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {jobs.length > 0 ? (
          jobs
            .slice(0, 6)
            .map((job) => <LatestJobCard key={job._id} job={job} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No jobs available</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestJobs;
