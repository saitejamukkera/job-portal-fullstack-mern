import Hero from "./Hero";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/customHooks/useGetAllJobs";

function Home() {
  useGetAllJobs();
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
