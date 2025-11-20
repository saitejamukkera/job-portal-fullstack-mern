import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LuLogOut } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { ModeToggle } from "../ui/mode-toggle";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const navigate = useNavigate();

  // Listen for login/logout changes across app
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Logout handler
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/login");
  }

  return (
    <div className="bg-white dark:bg-gray-950 shadow-sm dark:shadow-lg transition-colors">
      <div className="flex justify-between items-center mx-auto max-w-7xl h-16 px-4">
        {/* Logo */}
        <div className="cursor-pointer">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
            Job<span className="text-[#F83002]">Portal</span>
          </h1>
        </div>

        <div className="flex items-center font-medium gap-7">
          <ul className="flex items-center gap-5">
            <li className="cursor-pointer text-gray-800 dark:text-gray-200 transition-colors hover:text-[#F83002] dark:hover:text-[#F83002]">
              Home
            </li>
            <li className="cursor-pointer text-gray-800 dark:text-gray-200 transition-colors hover:text-[#F83002] dark:hover:text-[#F83002]">
              Browse
            </li>
            <li className="cursor-pointer text-gray-800 dark:text-gray-200 transition-colors hover:text-[#F83002] dark:hover:text-[#F83002]">
              Jobs
            </li>
          </ul>

          {/* Conditional Rendering */}
          {!user ? (
            <div className="flex gap-5">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="cursor-pointer font-medium"
                >
                  Login
                </Button>
              </Link>

              <Link to="/signup">
                <Button className="cursor-pointer font-medium">Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <Avatar className="cursor-pointer size-10 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 transition">
                  <AvatarImage
                    src={
                      user?.profile?.profilePicture
                        ? `http://localhost:3000/${user.profile.profilePicture}`
                        : "https://github.com/shadcn.png"
                    }
                  />
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-72 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 transition-colors">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="size-14 shadow-sm">
                    <AvatarImage
                      src={
                        user?.profile?.profilePicture
                          ? `http://localhost:3000/${user.profile.profilePicture}`
                          : "https://github.com/shadcn.png"
                      }
                    />
                  </Avatar>

                  <div className="flex flex-col">
                    <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100 transition-colors">
                      {user.fullName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-3" />

                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    className="w-full flex justify-start gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FaRegUser className="size-5" />
                    <span className="text-sm font-medium">View Profile</span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full flex justify-start gap-3 px-3 py-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-800 transition-colors"
                  >
                    <LuLogOut className="size-5 text-red-500 dark:text-red-400" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-300">
                      Logout
                    </span>
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
