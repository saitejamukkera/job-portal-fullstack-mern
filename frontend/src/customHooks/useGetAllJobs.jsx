import { JOB_API_END_POINT } from "@/utilis/const_endpoints";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setJobs } from "@/redux/jobSlice";

function useGetAllJobs() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${JOB_API_END_POINT}`);
        if (response.status === 200) {
          dispatch(setJobs(response.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);
}

export default useGetAllJobs;
