import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSingleCompany } from "@/redux/companySlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utilis/const_endpoints";
import { Spinner } from "@/components/ui/spinner";

function CreateCompany() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState(""); // Error state for company name
  const [loading, setLoading] = useState(false);

  // Validate input
  function validate() {
    if (companyName.trim() === "") {
      setCompanyNameError("Company name is required");
      return false;
    }
    setCompanyNameError(""); // Clear error if valid
    return true;
  }

  async function registerNewCompany(e) {
    e.preventDefault(); // Prevent default form submission

    // Validate input before submission
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to create a company.");
        return;
      }

      const resp = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        { headers: { Authorization: `${token}` } }
      );

      if (resp.status === 201) {
        dispatch(setSingleCompany(resp?.data?.company));
        toast.success(resp?.data?.message || "Company created successfully");
        const companyId = resp?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.error("Error creating company:", error);
      if (error.response && error.response.status === 400) {
        setCompanyNameError(
          error?.response?.data?.message + " Please try a new name." ||
            "Error occurred."
        );
      } else {
        toast.error("Failed to create company. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setCompanyName(value);

    if (value.trim() !== "") {
      setCompanyNameError(""); // Clear error if the input is not empty
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="my-10">
        <h1 className="font-bold text-2xl">Your Company Name</h1>
        <p className="text-muted-foreground mt-2">
          Create a new company profile to start posting job openings and
          managing your organization's presence on our platform. You can change
          it later.
        </p>
      </div>

      <form onSubmit={registerNewCompany}>
        {/* Company Name Field */}
        <Label className="mt-6">Company Name</Label>
        <Input
          type="text"
          className={`mt-3 ${companyNameError ? "border-red-500" : ""}`} // Red border on error
          placeholder="Enter your company name"
          onChange={handleInputChange} // Handle change to clear error
          value={companyName}
        />
        {companyNameError && (
          <p className="text-red-500 text-sm mt-2">{companyNameError}</p> // Error message below input
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex ">
          <Button
            type="button"
            variant="outline"
            className="mr-4 cursor-pointer"
            onClick={() => {
              navigate("/admin/companies");
            }}
          >
            Cancel
          </Button>
          {loading ? (
            <Button className="cursor-pointer" disabled>
              <Spinner />
              Creating company...
            </Button>
          ) : (
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={companyNameError !== "" || companyName.trim() === ""} // Disable submit if there's an error
            >
              Create Company
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateCompany;
