import Hero from "./Hero";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/customHooks/useGetAllJobs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
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
