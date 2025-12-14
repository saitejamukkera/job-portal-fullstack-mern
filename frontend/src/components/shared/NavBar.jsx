import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LuLogOut, LuMenu, LuX } from "react-icons/lu";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(setUser(null));

      setOpen(false);
      setMobileMenuOpen(false);

      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error(error?.message);
      toast.error("Error logging out. Please try again.");
    }
  }

  const NavLinks = ({ mobile = false }) => {
    const baseClasses = mobile
      ? "block py-2 px-4 text-base hover:bg-muted rounded-md transition-colors"
      : "cursor-pointer hover:text-[#F83002] transition-colors";

    return user && user?.role === "recruiter" ? (
      <>
        <Link
          to="/admin/companies"
          className={baseClasses}
          onClick={() => setMobileMenuOpen(false)}
        >
          Companies
        </Link>
        <Link
          to="/admin/jobs"
          className={baseClasses}
          onClick={() => setMobileMenuOpen(false)}
        >
          Jobs
        </Link>
      </>
    ) : (
      <>
        <Link
          to="/"
          className={baseClasses}
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/browse"
          className={baseClasses}
          onClick={() => setMobileMenuOpen(false)}
        >
          Browse
        </Link>
        <Link
          to="/jobs"
          className={baseClasses}
          onClick={() => setMobileMenuOpen(false)}
        >
          Jobs
        </Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-border shadow-sm transition-colors">
      <div className="flex justify-between items-center mx-auto max-w-7xl h-16 px-4">
        {/* Logo */}
        <div className="cursor-pointer">
          <Link to={user?.role === "recruiter" ? "/admin/companies" : "/"}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors">
              Job<span className="text-[#F83002]">Radar</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center font-medium gap-6">
          <ul className="flex items-center gap-5 text-sm">
            <NavLinks />
          </ul>

          {/* Auth Buttons / User Avatar */}
          {!user ? (
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="cursor-pointer">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger>
                <Avatar className="cursor-pointer size-9 hover:ring-2 hover:ring-primary/50 transition-all">
                  <AvatarImage
                    src={
                      user?.profile?.profilePictureURL ||
                      "https://github.com/shadcn.png"
                    }
                  />
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-72 p-4 rounded-xl shadow-xl border border-border bg-background">
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
                    <h4 className="font-semibold text-foreground">
                      {user?.fullName}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {user?.profile?.bio || "No bio"}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-border my-3" />

                <div className="flex flex-col gap-1">
                  <Link to="/view-profile" onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full flex justify-start gap-3 px-3 py-2 cursor-pointer"
                    >
                      <FaRegUser className="size-4" />
                      <span>View Profile</span>
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full flex justify-start gap-3 px-3 py-2 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                  >
                    <LuLogOut className="size-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <LuX className="size-6" />
            ) : (
              <LuMenu className="size-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-2">
            <NavLinks mobile />

            <div className="h-px w-full bg-border my-3" />

            {!user ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full cursor-pointer">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full cursor-pointer">Signup</Button>
                </Link>
              </div>
            ) : (
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={
                        user?.profile?.profilePictureURL ||
                        "https://github.com/shadcn.png"
                      }
                    />
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/view-profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 cursor-pointer"
                  >
                    <FaRegUser className="size-4" />
                    View Profile
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-3 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                >
                  <LuLogOut className="size-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
