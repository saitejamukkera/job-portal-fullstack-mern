import {
  LuMail,
  LuPhone,
  LuPencil,
  LuFileText,
  LuBriefcase,
} from "react-icons/lu";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import AppliedJobs from "./AppliedJobs";
import { useState } from "react";
import UpdateProfileModal from "./UpdateProfileModal";
import { useSelector } from "react-redux";

function ViewProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const isResumeUploaded = Boolean(user?.profile?.resumeURL);

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8">
      {/* Profile Container */}
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-5 sm:p-8 shadow-sm">
        {/* Header with Avatar */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="size-20 sm:size-24 shadow-md border-2 border-border">
              <AvatarImage
                src={
                  user?.profile?.profilePictureURL ||
                  "https://github.com/shadcn.png"
                }
                alt="User avatar"
              />
            </Avatar>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="font-bold text-xl sm:text-2xl text-foreground">
                  {user?.fullName || "No Name Provided"}
                </h1>
                <Badge
                  variant="secondary"
                  className="mt-1.5 text-xs capitalize"
                >
                  <LuBriefcase className="size-3 mr-1" />
                  {user?.role || "User"}
                </Badge>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer rounded-full"
                onClick={() => setIsModalOpen(true)}
              >
                <LuPencil className="size-4" />
              </Button>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
              {user?.profile?.bio || "No bio available. Click edit to add one."}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-border" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-primary/10">
              <LuMail className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-primary/10">
              <LuPhone className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">
                {user?.phoneNumber || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Applicant-specific profile fields */}
        {user?.role === "applicant" && (
          <>
            {/* Skills */}
            <div className="mt-6">
              <h2 className="font-semibold text-base text-foreground mb-3">
                Skills
              </h2>

              {!user?.profile?.skills?.length ? (
                <p className="text-sm text-muted-foreground">
                  No skills added yet
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.profile.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Resume */}
            <div className="mt-6">
              <h2 className="font-semibold text-base text-foreground mb-3">
                Resume
              </h2>

              {isResumeUploaded ? (
                <Link
                  to={user?.profile?.resumeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <LuFileText className="size-4" />
                  <span className="text-sm font-medium">
                    {user?.profile?.resumeOriginalName || "View Resume"}
                  </span>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No resume uploaded
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Applied Jobs Section */}
      {user?.role === "applicant" && (
        <div className="max-w-3xl mx-auto mt-8">
          <h2 className="font-semibold text-lg text-foreground mb-4">
            Applied Jobs
          </h2>
          <AppliedJobs />
        </div>
      )}

      {/* Modal */}
      <UpdateProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}

export default ViewProfile;
