import { useSelector } from "react-redux";
import Job from "./Job";
import useGetAllJobs from "@/customHooks/useGetAllJobs";
import { Spinner } from "../ui/spinner";

function Browse() {
  useGetAllJobs();
  const { jobs, searchQuery, isLoading } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto px-4 my-10">
      {/* Title */}
      <h1 className="font-bold text-xl md:text-2xl">
        {searchQuery ? (
          <>
            Search Results for "{searchQuery}"{" "}
            {!isLoading && `(${jobs?.length})`}
          </>
        ) : (
          <>All Jobs {!isLoading && `(${jobs?.length})`}</>
        )}
      </h1>

      <hr className="border-border mt-4 mb-8" />

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner className="size-8 text-[#6A38C2]" />
        </div>
      ) : jobs?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <Job key={job?._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-10">
          No jobs found{searchQuery ? ` for "${searchQuery}"` : ""}.
        </div>
      )}
    </div>
  );
}

export default Browse;
