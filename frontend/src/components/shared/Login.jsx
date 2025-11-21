import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../../utilis/User_Endpoints";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("applicant"); // lowercase
  const [error, setError] = useState("");
  //const inputRef = useRef(null);
  //const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch(); // redux dispatch
  const { loading } = useSelector((store) => store.auth); // get loading from redux

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
        // Save token + user
        localStorage.setItem("token", `Bearer ${resp.data.token}`);
        localStorage.setItem("user", JSON.stringify(resp.data.user));

        toast.success(`Welcome back ${resp.data.user.fullName}.`);
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      setError(msg);
      toast.error(msg);
    } finally {
      dispatch(setLoading(false)); // set loading false in redux
    }
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4">
      <form
        className="
          w-full max-w-sm 
          border border-border 
          rounded-md p-6 my-10 
          shadow-sm 
          bg-background 
          text-foreground
        "
        onSubmit={handleSubmit}
      >
        <h1 className="font-semibold text-2xl mb-6 text-center">Login</h1>

        <div className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              onFocus={() => setError("")}
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
              onFocus={() => setError("")}
              required
            />
          </div>

          {/* Role */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <RadioGroup
                onValueChange={setRole}
                value={role}
                className="flex gap-4 mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="applicant" id="Applicant" />
                  <Label htmlFor="Applicant">Applicant</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recruiter" id="Recruiter" />
                  <Label htmlFor="Recruiter">Recruiter</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-center text-sm mt-2">{error}</p>
          )}

          {/* Button */}
          {loading ? (
            <Button disabled className="w-full cursor-not-allowed">
              <Spinner />
              Loading...
            </Button>
          ) : (
            <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
          )}

          <p className="text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
