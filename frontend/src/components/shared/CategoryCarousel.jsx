import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchQuery } from "@/redux/jobSlice";

const categoryNames = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Data Scientist",
  "UI/UX Designer",
  "Mobile Developer",
];

function CategoryCarousel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function searchJobHandler(query) {
    dispatch(setSearchQuery(query));
    navigate("/browse");
  }

  return (
    <div className="max-w-4xl mx-auto px-8 sm:px-12 my-8 sm:my-10">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 sm:-ml-4">
          {categoryNames.map((category, index) => (
            <CarouselItem
              key={index}
              className="pl-2 sm:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <Button
                onClick={() => searchJobHandler(category)}
                variant="outline"
                className="
                  w-full rounded-full cursor-pointer 
                  text-xs sm:text-sm font-medium
                  h-9 sm:h-10
                  hover:bg-primary hover:text-primary-foreground
                  hover:border-primary
                  transition-all duration-200
                "
              >
                {category}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 sm:-left-6 size-8 sm:size-10" />
        <CarouselNext className="-right-4 sm:-right-6 size-8 sm:size-10" />
      </Carousel>
    </div>
  );
}

export default CategoryCarousel;
