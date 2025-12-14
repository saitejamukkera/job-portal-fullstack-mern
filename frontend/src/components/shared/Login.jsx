import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../../utilis/const_endpoints";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import { LuMail, LuLock, LuUser, LuBriefcase } from "react-icons/lu";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("applicant");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      dispatch(setLoading(true));

      const resp = await axios.post(`${USER_API_END_POINT}/login`, {
        email,
        password,
        role,
      });

      if (resp.status === 200) {
        localStorage.setItem("token", `Bearer ${resp.data.token}`);
        localStorage.setItem("user", JSON.stringify(resp.data.user));
        dispatch(setUser(resp.data.user));
        toast.success(`Welcome back ${resp.data.user.fullName}.`);
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      setError(msg);
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-80px)] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to continue your job search
          </p>
        </div>

        <form
          className="
            border border-border 
            rounded-xl p-6 sm:p-8 
            shadow-lg 
            bg-card 
            text-card-foreground
          "
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <div className="relative mt-2">
                <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  onFocus={() => setError("")}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label className="text-sm font-medium">Password</Label>
              <div className="relative mt-2">
                <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  onFocus={() => setError("")}
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <Label className="text-sm font-medium">Login as</Label>
              <RadioGroup
                onValueChange={setRole}
                value={role}
                className="flex flex-wrap gap-4 mt-3"
              >
                <label
                  htmlFor="Applicant"
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all
                    ${
                      role === "applicant"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-muted-foreground"
                    }
                  `}
                >
                  <RadioGroupItem value="applicant" id="Applicant" />
                  <LuUser className="size-4" />
                  <span className="text-sm font-medium">Applicant</span>
                </label>

                <label
                  htmlFor="Recruiter"
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all
                    ${
                      role === "recruiter"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-muted-foreground"
                    }
                  `}
                >
                  <RadioGroupItem value="recruiter" id="Recruiter" />
                  <LuBriefcase className="size-4" />
                  <span className="text-sm font-medium">Recruiter</span>
                </label>
              </RadioGroup>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 text-center text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-medium cursor-pointer"
            >
              {loading ? (
                <>
                  <Spinner className="mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
