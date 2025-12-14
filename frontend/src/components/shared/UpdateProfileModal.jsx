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
import {
  LuUser,
  LuMail,
  LuPhone,
  LuFileText,
  LuImage,
  LuStar,
} from "react-icons/lu";

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
      <DialogContent className="max-w-[95vw] sm:max-w-md border border-border bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Update Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Make changes to your profile information
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* FULL NAME */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <LuUser className="size-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              value={input.fullName}
              onChange={(e) => setInput({ ...input, fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          {/* BIO */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Bio</Label>
            <Textarea
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <LuMail className="size-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              type="email"
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <LuPhone className="size-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              type="tel"
              value={input.phoneNumber}
              onChange={(e) =>
                setInput({ ...input, phoneNumber: e.target.value })
              }
              placeholder="+1 234 567 890"
            />
          </div>

          {/* APPLICANT-ONLY FIELDS */}
          {user?.role === "applicant" && (
            <>
              {/* SKILLS */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <LuStar className="size-4 text-muted-foreground" />
                  Skills
                </Label>
                <Input
                  value={input.skills}
                  onChange={(e) =>
                    setInput({ ...input, skills: e.target.value })
                  }
                  placeholder="React, Node.js, TypeScript..."
                />
                <p className="text-xs text-muted-foreground">
                  Separate skills with commas
                </p>
              </div>

              {/* RESUME */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <LuFileText className="size-4 text-muted-foreground" />
                  Resume
                </Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setInput({ ...input, resume: e.target.files[0] })
                  }
                  className="cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {input.resume && (
                  <p className="text-xs text-muted-foreground">
                    {input.resume.name}
                  </p>
                )}
              </div>
            </>
          )}

          {/* PROFILE PIC (Both roles) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <LuImage className="size-4 text-muted-foreground" />
              Profile Picture
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setInput({ ...input, profilePicture: e.target.files[0] })
              }
              className="cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {input.profilePicture && (
              <p className="text-xs text-muted-foreground">
                {input.profilePicture.name}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 font-medium cursor-pointer"
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 size-4" /> Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateProfileModal;
