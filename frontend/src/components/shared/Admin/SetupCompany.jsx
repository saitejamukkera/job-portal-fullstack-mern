import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utilis/const_endpoints";
import { Spinner } from "@/components/ui/spinner";
import useGetCompanyByID from "@/customHooks/useGetCompanyByID";

function SetupCompany() {
  const params = useParams();
  const isFetching = useGetCompanyByID(params.id);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const singleCompany = useSelector((store) => store.company.singleCompany);

  const [input, setInput] = useState({
    companyName: "",
    description: "",
    website: "",
    location: "",
    logoURL: "",
    logoOriginalName: "",
    file: null,
  });

  // Load company when editing
  useEffect(() => {
    setInput((prev) => ({
      ...prev,
      companyName: singleCompany.companyName || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      logoURL: singleCompany.logoURL || "",
      logoOriginalName: singleCompany.logoOriginalName || "",
    }));
  }, [singleCompany]);

  function handleChange(e) {
    const { name, value, files } = e.target;

    // File upload
    if (name === "logo") {
      setInput((prev) => ({ ...prev, file: files[0] }));
      return;
    }

    // Text input
    setInput((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("companyName", input.companyName);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);

    if (input.file) {
      formData.append("logo", input.file); // must match multer field
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const resp = await axios.put(
        `${COMPANY_API_END_POINT}/${params.id}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (resp.status === 200) {
        toast.success(resp.data.message || "Company details updated");
        navigate("/admin/companies");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update company.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <h1 className="text-2xl font-bold">Setup Your Company</h1>
      </div>

      {/* Form */}
      {isFetching ? (
        <div className="flex justify-center items-center py-20">
          <Spinner className="w-8 h-8" /> Loading company details...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Company Name</Label>
            <Input
              className="col-span-3"
              name="companyName"
              value={input.companyName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Description</Label>
            <Input
              className="col-span-3"
              name="description"
              value={input.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Website</Label>
            <Input
              className="col-span-3"
              name="website"
              value={input.website}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Location</Label>
            <Input
              className="col-span-3"
              name="location"
              value={input.location}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Company Logo</Label>
            <Input
              className="col-span-3"
              type="file"
              name="logo" // MUST MATCH multer name
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          {loading ? (
            <Button disabled className="w-full cursor-pointer">
              <Spinner />
              Saving...
            </Button>
          ) : (
            <Button type="submit" className="w-full cursor-pointer">
              Save Company Details
            </Button>
          )}
        </form>
      )}
    </div>
  );
}

export default SetupCompany;
