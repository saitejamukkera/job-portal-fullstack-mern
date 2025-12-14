import { useSelector } from "react-redux";
import Job from "./Job";
import useGetAllJobs from "@/customHooks/useGetAllJobs";
import useGetAppliedJobs from "@/customHooks/useGetAppliedJobs";
import { Spinner } from "../ui/spinner";
import { motion } from "framer-motion";
import { LuSearch } from "react-icons/lu";

function Browse() {
  useGetAllJobs();
  useGetAppliedJobs();
  const { jobs, searchQuery, isLoading } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 my-8 sm:my-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-foreground">
          {searchQuery ? <>Results for "{searchQuery}"</> : "All Jobs"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {!isLoading && (
            <>
              {jobs?.length || 0} job{jobs?.length !== 1 ? "s" : ""} found
              {searchQuery && " matching your search"}
            </>
          )}
        </p>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <Spinner className="size-8 text-primary" />
          <p className="text-muted-foreground text-sm">Searching jobs...</p>
        </div>
      ) : jobs?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {jobs?.map((job, index) => (
            <motion.div
              key={job?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Job job={job} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
            <LuSearch className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No jobs found</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `We couldn't find any jobs matching "${searchQuery}". Try a different search term.`
              : "No jobs are currently available. Check back later."}
          </p>
        </div>
      )}
    </div>
  );
}

export default Browse;
