import NavBar from "./components/shared/NavBar";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import { Routes, Navigate, Route } from "react-router-dom";
import Login from "./components/shared/Login";
import Signup from "./components/shared/Signup";
import Home from "./components/shared/Home";
import Jobs from "./components/shared/Jobs";
import Browse from "./components/shared/Browse";
import ViewProfile from "./components/shared/ViewProfile";
import JobDescription from "./components/shared/JobDescription";
import Companies from "./components/shared/Admin/Companies";
import CreateCompany from "./components/shared/Admin/CreateCompany";
import SetupCompany from "./components/shared/Admin/SetupCompany";
import AdminJobs from "./components/shared/Admin/AdminJobs";
import CreateJob from "./components/shared/Admin/CreateJob";
import SetupJob from "./components/shared/Admin/SetupJob";
import Applicants from "./components/shared/Admin/Applicants";
import {
  ProtectedRoute,
  RecruiterRoute,
  GuestRoute,
} from "./components/shared/ProtectedRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/browse" element={<Browse />} />
        <Route
          path="/view-profile"
          element={
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/description/:id" element={<JobDescription />} />
        <Route path="*" element={<Navigate to="/" />} />

        {/* Admin Routes - Protected for Recruiters only */}
        <Route
          path="/admin/companies"
          element={
            <RecruiterRoute>
              <Companies />
            </RecruiterRoute>
          }
        />
        <Route
          path="/admin/companies/create"
          element={
            <RecruiterRoute>
              <CreateCompany />
            </RecruiterRoute>
          }
        />
        <Route
          path="/admin/companies/:id"
          element={
            <RecruiterRoute>
              <SetupCompany />
            </RecruiterRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <RecruiterRoute>
              <AdminJobs />
            </RecruiterRoute>
          }
        />
        <Route
          path="/admin/jobs/create"
          element={
            <RecruiterRoute>
              <CreateJob />
            </RecruiterRoute>
          }
        />
        <Route
          path="/admin/jobs/:id"
          element={
            <RecruiterRoute>
              <SetupJob />
            </RecruiterRoute>
          }
        />
        <Route
          path="/admin/jobs/:id/applicants"
          element={
            <RecruiterRoute>
              <Applicants />
            </RecruiterRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
