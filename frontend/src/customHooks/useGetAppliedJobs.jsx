import axios from "axios";
import { useEffect, useState } from "react";
import { APPLICATION_API_END_POINT } from "@/utilis/const_endpoints";
import { useDispatch, useSelector } from "react-redux";
import { setAllAppliedJobs } from "@/redux/jobSlice";

export default function useGetAppliedJobs() {
  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchAppliedJobs() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await axios.get(`${APPLICATION_API_END_POINT}/my`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 200) {
          dispatch(setAllAppliedJobs(response.data.applications));
        }
      } catch (err) {
        // Handle 404 as empty array (no applications found)
        if (err?.response?.status === 404) {
          dispatch(setAllAppliedJobs([]));
        } else {
          setError(err);
          console.error("Error fetching applied jobs:", err);
        }
      }
      setLoading(false);
    }
    if (user && user.role === "applicant") {
      fetchAppliedJobs();
    } else {
      setLoading(false);
    }
  }, [user, dispatch]);

  return { appliedJobs: allAppliedJobs, loading, error };
}
