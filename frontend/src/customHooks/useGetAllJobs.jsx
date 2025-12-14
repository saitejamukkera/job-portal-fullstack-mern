import { JOB_API_END_POINT } from "@/utilis/const_endpoints";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setJobs, setIsLoading } from "@/redux/jobSlice";

function useGetAllJobs() {
  const dispatch = useDispatch();
  const {
    searchQuery,
    filters = { location: [], jobType: [], salaryRange: [] },
  } = useSelector((store) => store.job);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    const fetchJobs = async () => {
      dispatch(setIsLoading(true));
      try {
        // Build query params
        const params = new URLSearchParams();
        if (searchQuery) params.append("keyword", searchQuery);
        if (filters.location?.length)
          params.append("location", filters.location.join(","));
        if (filters.jobType?.length)
          params.append("jobType", filters.jobType.join(","));
        if (filters.salaryRange?.length)
          params.append("salaryRange", filters.salaryRange.join(","));

        const response = await axios.get(
          `${JOB_API_END_POINT}?${params.toString()}`,
          { signal: abortControllerRef.current.signal }
        );
        if (response.status === 200) {
          dispatch(setJobs(response.data.jobs));
        }
      } catch (error) {
        // Don't log abort errors
        if (!axios.isCancel(error)) {
          console.error("Error fetching jobs:", error);
        }
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    // Debounce the search - wait 300ms before fetching
    const debounceTimer = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchQuery, filters, dispatch]);
}

export default useGetAllJobs;
