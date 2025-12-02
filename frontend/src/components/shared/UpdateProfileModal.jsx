import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Spinner } from "../ui/spinner";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utilis/const_endpoints";
import { setUser } from "@/redux/authSlice";

function UpdateProfileModal({ isModalOpen, setIsModalOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    profilePicture: null,
    resume: null,
  });

  useEffect(() => {
    if (isModalOpen && user) {
      setInput({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        profilePicture: null,
        resume: null,
      });
    }
  }, [isModalOpen, user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);

    // Recruiters & applicants BOTH can update profile picture
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
    }

    // Applicants ONLY
    if (user?.role === "applicant") {
      formData.append("skills", input.skills);

      if (input.resume) {
        formData.append("resume", input.resume);
      }
    }

    try {
      const token = localStorage.getItem("token");

      const resp = await axios.put(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (resp.status === 200) {
        toast.success("Profile updated");
        dispatch(setUser(resp.data.user));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[450px] border border-border bg-background">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Update your profile information
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* FULL NAME */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Name</Label>
            <Input
              value={input.fullName}
              onChange={(e) => setInput({ ...input, fullName: e.target.value })}
              className="col-span-3"
            />
          </div>

          {/* BIO */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label>Bio</Label>
            <Textarea
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              className="col-span-3"
            />
          </div>

          {/* EMAIL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Email</Label>
            <Input
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
              className="col-span-3"
            />
          </div>

          {/* PHONE */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Number</Label>
            <Input
              value={input.phoneNumber}
              onChange={(e) =>
                setInput({ ...input, phoneNumber: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          {/* ------------------------ APPLICANT-ONLY FIELDS ------------------------ */}
          {user?.role === "applicant" && (
            <>
              {/* SKILLS */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Skills</Label>
                <Input
                  value={input.skills}
                  onChange={(e) =>
                    setInput({ ...input, skills: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>

              {/* RESUME */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Resume</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setInput({ ...input, resume: e.target.files[0] })
                  }
                  className="col-span-3"
                />
              </div>
            </>
          )}
          {/* ------------------------ END APPLICANT FIELDS ------------------------ */}

          {/* PROFILE PIC (Both roles) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Profile Picture</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setInput({ ...input, profilePicture: e.target.files[0] })
              }
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            {loading ? (
              <Button disabled className="w-full">
                <Spinner className="mr-2" /> Updating...
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateProfileModal;
