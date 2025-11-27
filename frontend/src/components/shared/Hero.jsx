import { Input } from "../ui/input";
import { LuSearch } from "react-icons/lu";
import { Button } from "../ui/button";
import { Typewriter } from "react-simple-typewriter";

function Hero() {
  return (
    <section className="text-center px-4 pt-12 md:pt-16 pb-0">
      <div className="flex flex-col gap-6">
        {/* Badge */}
        <span
          className="
            mx-auto px-4 py-2 rounded-full 
            bg-gray-100 dark:bg-gray-800 
            text-[#F83002] 
            font-medium text-sm
          "
        >
          No.1 Website for Finding Jobs
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Search, Apply & Get your <br />
          <span className="text-[#6A38C2]">
            <Typewriter
              words={["Perfect Job", "Ideal Job", "Dream Job"]}
              loop={1}
              cursor={true}
              cursorStyle="_"
              typeSpeed={100}
              deleteSpeed={75}
              delaySpeed={1000}
            />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto text-muted-foreground max-w-xl text-sm sm:text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quos
          nihil alias, cupiditate excepturi modi repudiandae.
        </p>

        {/* Search bar */}
        <div
          className="
            flex w-full max-w-lg mx-auto 
            shadow-lg rounded-full 
            bg-background border border-border
            overflow-hidden
          "
        >
          <Input
            type="text"
            placeholder="Search for jobs..."
            className="
              flex-grow h-12 text-base sm:text-lg 
              rounded-l-full border-none shadow-none 
              bg-background
            "
          />

          <Button
            className="
              h-12 w-12 rounded-r-full border-0 
              bg-[#6A38C2] hover:bg-[#6024c7] 
              flex items-center justify-center 
              cursor-pointer
            "
          >
            <LuSearch className="size-5 text-white" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
