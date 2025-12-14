import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import { USER_API_END_POINT } from "../../utilis/const_endpoints";
import {
  LuMail,
  LuLock,
  LuUser,
  LuBriefcase,
  LuPhone,
  LuUpload,
} from "react-icons/lu";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("applicant");
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      dispatch(setLoading(true));

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      formData.append("role", role);

      if (file) {
        formData.append("profilePic", file);
      }

      const resp = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (resp.status === 201) {
        toast.success(resp.data.message);
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
      console.log("error while registering:", err);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-80px)] px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Create Account
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Start your journey to find your dream job
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
            {/* Full Name */}
            <div>
              <Label className="text-sm font-medium">Full Name</Label>
              <div className="relative mt-2">
                <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  onFocus={() => setError("")}
                  required
                />
              </div>
            </div>

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

            {/* Two column layout for password and phone on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Password */}
              <div>
                <Label className="text-sm font-medium">Password</Label>
                <div className="relative mt-2">
                  <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    onFocus={() => setError("")}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <Label className="text-sm font-medium">Phone Number</Label>
                <div className="relative mt-2">
                  <LuPhone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+1 234 567 890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    onFocus={() => setError("")}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Role */}
            <div>
              <Label className="text-sm font-medium">Register as</Label>
              <RadioGroup
                onValueChange={setRole}
                value={role}
                className="flex flex-wrap gap-3 mt-3"
              >
                <label
                  htmlFor="applicant"
                  className={`
                    flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all
                    ${
                      role === "applicant"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-muted-foreground"
                    }
                  `}
                >
                  <RadioGroupItem
                    value="applicant"
                    id="applicant"
                    className="sr-only"
                  />
                  <LuUser className="size-4" />
                  <span className="text-sm font-medium">Applicant</span>
                </label>

                <label
                  htmlFor="recruiter"
                  className={`
                    flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all
                    ${
                      role === "recruiter"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-muted-foreground"
                    }
                  `}
                >
                  <RadioGroupItem
                    value="recruiter"
                    id="recruiter"
                    className="sr-only"
                  />
                  <LuBriefcase className="size-4" />
                  <span className="text-sm font-medium">Recruiter</span>
                </label>
              </RadioGroup>
            </div>

            {/* Profile Picture */}
            <div>
              <Label className="text-sm font-medium">
                Profile Picture (Optional)
              </Label>
              <div className="relative mt-2">
                <Input
                  id="picture"
                  type="file"
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <LuUpload className="size-3" />
                    {file.name}
                  </p>
                )}
              </div>
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
