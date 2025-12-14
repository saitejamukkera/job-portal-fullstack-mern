import { Input } from "../ui/input";
import { LuSearch } from "react-icons/lu";
import { Button } from "../ui/button";
import { Typewriter } from "react-simple-typewriter";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function searchJobHandler() {
    dispatch(setSearchQuery(query));
    navigate("/browse");
  }
  return (
    <section className="text-center px-4 sm:px-6 pt-10 sm:pt-12 md:pt-20 pb-8">
      <div className="flex flex-col gap-5 sm:gap-6 max-w-4xl mx-auto">
        {/* Badge */}
        <span
          className="
            mx-auto px-4 py-2 rounded-full 
            bg-gradient-to-r from-orange-50 to-red-50 
            dark:from-orange-950/30 dark:to-red-950/30
            text-[#F83002] 
            font-medium text-xs sm:text-sm
            border border-orange-200 dark:border-orange-900/50
          "
        >
          🔥 No.1 Website for Finding Jobs
        </span>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
          Search, Apply & Get your <br className="hidden sm:block" />
          <span className="text-[#6A38C2] dark:text-purple-400">
            <Typewriter
              words={["Perfect Job", "Ideal Job", "Dream Job"]}
              loop={0}
              cursor={true}
              cursorStyle="_"
              typeSpeed={100}
              deleteSpeed={75}
              delaySpeed={1500}
            />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto text-muted-foreground max-w-xl text-sm sm:text-base leading-relaxed px-4">
          Discover thousands of job opportunities from top companies. Your next
          career move starts here.
        </p>

        {/* Search bar */}
        <div
          className="
            flex w-full max-w-md sm:max-w-lg mx-auto 
            shadow-lg hover:shadow-xl transition-shadow duration-300
            rounded-full 
            bg-background border border-border
            overflow-hidden
          "
        >
          <Input
            type="text"
            placeholder="Job title, keywords..."
            className="
              flex-grow h-11 sm:h-12 text-sm sm:text-base 
              rounded-l-full border-none shadow-none 
              bg-background pl-4 sm:pl-5
              focus-visible:ring-0
            "
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
            value={query}
          />

          <Button
            className="
              h-11 sm:h-12 w-11 sm:w-12 rounded-r-full border-0 
              bg-[#6A38C2] hover:bg-[#5b2eb0] 
              dark:bg-purple-600 dark:hover:bg-purple-700
              flex items-center justify-center 
              cursor-pointer transition-colors
            "
            onClick={searchJobHandler}
          >
            <LuSearch className="size-4 sm:size-5 text-white" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-4 text-muted-foreground text-xs sm:text-sm">
          <div className="text-center">
            <p className="font-bold text-lg sm:text-2xl text-foreground">
              10K+
            </p>
            <p>Jobs Available</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg sm:text-2xl text-foreground">5K+</p>
            <p>Companies</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg sm:text-2xl text-foreground">
              50K+
            </p>
            <p>Job Seekers</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
