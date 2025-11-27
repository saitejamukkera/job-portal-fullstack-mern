import { JOB_API_END_POINT } from "@/utilis/const_endpoints";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setJob } from "@/redux/jobSlice";

function useGetSingleJob(jobId) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    let isMounted = true;

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${JOB_API_END_POINT}/${jobId}`);

        if (isMounted && response.status === 200) {
          dispatch(setJob(response.data.job));
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching job:", err);
          setError("Failed to load job details");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJob();

    return () => {
      isMounted = false;
    };
  }, [jobId, dispatch]);

  return { loading, error };
}

export default useGetSingleJob;
