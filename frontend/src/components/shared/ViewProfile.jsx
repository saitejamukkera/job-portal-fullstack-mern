import { Contact2, Mail, PenBoxIcon } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";
import AppliedJobs from "./AppliedJobs";
import { useState } from "react";
import UpdateProfileModal from "./UpdateProfileModal";
import { useSelector } from "react-redux";

function ViewProfile() {
  //const skills = ["JavaScript", "React", "Node.js", "CSS", "HTML"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const isResumeUploaded = Boolean(user?.profile?.resumeURL);

  return (
    <div className="px-4">
      {/* Profile Container */}
      <div className="max-w-4xl mx-auto bg-background border border-border rounded-2xl my-6 p-6 md:p-8 shadow-sm">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 shadow-sm">
              <AvatarImage
                src={
                  user?.profile?.profilePictureURL ||
                  "https://github.com/shadcn.png"
                }
                alt="User avatar"
              />
            </Avatar>

            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-xl">
                {user?.fullName || "No Name Provided"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {user?.profile?.bio || "No bio available"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="cursor-pointer mt-2 md:mt-0"
            onClick={() => setIsModalOpen(true)}
          >
            <PenBoxIcon className="size-5" />
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-3 text-base">
          <div className="flex items-center gap-3">
            <Mail className="opacity-70 size-5" />
            <span className="text-sm md:text-base">{user?.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Contact2 className="opacity-70 size-5" />
            <span className="md:text-base !text-sm">
              {String(user?.phoneNumber)}
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h1 className="font-semibold text-md">Skills</h1>

          {user?.profile?.skills?.length === 0 ? (
            <span className="text-muted-foreground">NA</span>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.profile?.skills.map((skill, idx) => (
                <Badge key={idx} className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Resume */}
        <div className="flex items-center gap-3 mt-6">
          <Label className="font-semibold text-md">Resume:</Label>

          {isResumeUploaded ? (
            <Link
              to={user?.profile?.resumeURL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 dark:text-blue-400 hover:opacity-80"
            >
              {user?.profile?.resumeOriginalName || "View Resume"}
            </Link>
          ) : (
            <span className="text-muted-foreground">NA</span>
          )}
        </div>
      </div>

      {/* Applied Jobs Section */}
      {user?.profile?.companyApplied.length > 0 ? (
        <div className="mt-6 max-w-4xl mx-auto px-1">
          <h1 className="font-semibold text-md mb-3">Applied Jobs</h1>
          <AppliedJobs />
        </div>
      ) : (
        <div className="mt-6 max-w-4xl mx-auto px-1 text-center text-muted-foreground">
          No applied jobs found.
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
