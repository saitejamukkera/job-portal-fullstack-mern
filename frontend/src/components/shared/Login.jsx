import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Applicant");
  const [error, setError] = useState("");

  async function handleSubmit() {
    console.log("handle submit");
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

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <RadioGroup
                onValueChange={setRole}
                value={role}
                className="flex gap-4 mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Applicant" id="Applicant" />
                  <Label htmlFor="Applicant">Applicant</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Recruiter" id="Recruiter" />
                  <Label htmlFor="Recruiter">Recruiter</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button className="w-full mt-6 cursor-pointer">Login</Button>

          {error && (
            <p className="text-red-500 text-center text-sm mt-2">{error}</p>
          )}

          <p className="text-center mt-4 text-muted-foreground">
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
