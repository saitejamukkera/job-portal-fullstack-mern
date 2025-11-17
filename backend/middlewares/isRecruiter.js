export default function isRecruiter(req, res, next) {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ message: "Access denied. Recruiter only." });
  }
  next();
}
