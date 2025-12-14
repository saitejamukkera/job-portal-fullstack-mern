import Hero from "./Hero";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/customHooks/useGetAllJobs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "@/redux/jobSlice";

function Home() {
  const dispatch = useDispatch();

  // Clear search query when visiting Home page to show all jobs
  useEffect(() => {
    dispatch(setSearchQuery(""));
  }, [dispatch]);

  useGetAllJobs();

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    user?.role === "recruiter" && navigate("/admin/companies");
  }, []);

  return (
    <div>
      {/* <NavBar /> */}
      <Hero />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  );
}

export default Home;
