import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LuLogOut } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { ModeToggle } from "../ui/mode-toggle";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";

function NavBar() {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  function handleLogout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(setUser(null));

      setOpen(false);

      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error(error?.message);
      toast.error("Error logging out. Please try again.");
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950 shadow-sm dark:shadow-lg transition-colors">
      <div className="flex justify-between items-center mx-auto max-w-7xl h-16 px-4">
        <div className="cursor-pointer">
          <Link to="/">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
              Job<span className="text-[#F83002]">Portal</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center font-medium gap-7">
          <ul className="flex items-center gap-5">
            <Link to="/" className="cursor-pointer hover:text-[#F83002]">
              Home
            </Link>
            <Link to="/browse" className="cursor-pointer hover:text-[#F83002]">
              Browse
            </Link>
            <Link to="/jobs" className="cursor-pointer hover:text-[#F83002]">
              Jobs
            </Link>
          </ul>

          {!user ? (
            <div className="flex gap-5">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="signup">
                <Button>Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger>
                <Avatar className="cursor-pointer size-10 hover:ring-2 transition">
                  <AvatarImage
                    src={
                      user?.profile?.profilePictureURL ||
                      "https://github.com/shadcn.png"
                    }
                  />
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-72 p-4 rounded-xl shadow-xl border">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="size-14 shadow-sm">
                    <AvatarImage
                      src={
                        user?.profile?.profilePictureURL ||
                        "https://github.com/shadcn.png"
                      }
                    />
                  </Avatar>

                  <div className="flex flex-col gap-1">
                    <h4 className="font-semibold">{user?.fullName}</h4>
                    <p className="text-sm text-gray-500">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-200 my-3" />

                <div className="flex flex-col gap-1">
                  <Link to="/view-profile" onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full flex justify-start gap-3 px-3 py-2 cursor-pointer"
                    >
                      <FaRegUser className="size-5" />
                      <span>View Profile</span>
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full flex justify-start gap-3 px-3 py-2 cursor-pointer"
                  >
                    <LuLogOut className="size-5 text-red-500" />
                    <span className="text-red-500">Logout</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
