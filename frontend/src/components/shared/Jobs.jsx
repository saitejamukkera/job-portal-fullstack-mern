import { useState } from "react";
import Job from "./Job";
import FilterCard from "./FilterCard";
import { Button } from "../ui/button";
import { X, SlidersHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/customHooks/useGetAllJobs";
import useGetAppliedJobs from "@/customHooks/useGetAppliedJobs";
import { Spinner } from "../ui/spinner";
import { motion, AnimatePresence } from "framer-motion";

function Jobs() {
  useGetAllJobs();
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { jobs, isLoading, filters = { location: [], jobType: [], salaryRange: [] } } = useSelector((store) => store.job);

  const activeFilterCount =
    (filters.location?.length || 0) +
    (filters.jobType?.length || 0) +
    (filters.salaryRange?.length || 0);

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Browse Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {!isLoading && `${jobs?.length || 0} jobs found`}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="md:hidden cursor-pointer gap-2"
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 sm:w-80 
          bg-background border-r border-border 
          shadow-xl z-50 
          transform transition-transform duration-300 ease-out
          md:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Filters</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">
          <FilterCard />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
          <div className="sticky top-20">
            <FilterCard />
          </div>
        </div>

        {/* Job Cards */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20 gap-3">
              <Spinner className="size-8 text-primary" />
              <p className="text-muted-foreground text-sm">Loading jobs...</p>
            </div>
          ) : jobs?.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-foreground">No jobs found</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
            >
              {jobs?.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Job job={job} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
