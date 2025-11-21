import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../../utilis/User_Endpoints";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("applicant");
  const [error, setError] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      formData.append("role", role);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const resp = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (resp.status === 201) {
        toast.success(resp.data.message);
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
      console.log("error while registering:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4">
      <form
        className="
          w-full max-w-xl 
          border border-border 
          rounded-md p-6 my-10 
          shadow-sm 
          bg-background 
          text-foreground
        "
        onSubmit={handleSubmit}
      >
        <h1 className="font-semibold text-2xl mb-6 text-center">Sign Up</h1>

        <div className="flex flex-col gap-4">
          <div>
            <Label>Full Name</Label>
            <Input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              placeholder="xxxxxxxxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <RadioGroup
                onValueChange={setRole}
                value={role}
                className="flex gap-4 mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="applicant" id="applicant" />
                  <Label htmlFor="applicant">Applicant</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recruiter" id="recruiter" />
                  <Label htmlFor="recruiter">Recruiter</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="w-full">
              <Label htmlFor="picture">Profile Picture (Optional)</Label>
              <Input
                id="picture"
                type="file"
                className="cursor-pointer mt-3"
                onChange={(e) => setProfilePic(e.target.files[0])}
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 cursor-pointer">
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          {error && (
            <p className="text-red-500 text-center text-sm mt-2">{error}</p>
          )}

          <p className="text-center mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
