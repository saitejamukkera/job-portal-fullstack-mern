import { useState } from "react";
import Job from "./Job";
import FilterCard from "./FilterCard";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/customHooks/useGetAllJobs";
import { Spinner } from "../ui/spinner";
import { motion } from "framer-motion";

function Jobs() {
  useGetAllJobs();
  const [open, setOpen] = useState(false);
  const { jobs, isLoading } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto mt-6 px-3 sm:px-4">
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Button onClick={() => setOpen(true)} className="w-full cursor-pointer">
          Filters
        </Button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border shadow-xl z-50 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-14 px-4">
          <FilterCard />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Sidebar */}
        <div
          className="hidden md:block w-full md:w-1/4 lg:w-1/5
        "
        >
          <FilterCard />
        </div>

        {/* Job Cards */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner className="size-8 text-[#6A38C2]" />
            </div>
          ) : jobs?.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No jobs found.
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 w-full"
            >
              {jobs?.map((job) => (
                <Job key={job._id} job={job} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
