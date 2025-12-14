import NavBar from "./components/shared/NavBar";
import { ThemeProvider } from "./components/shared/Themeprovider";
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

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/view-profile" element={<ViewProfile />} />
        <Route path="/description/:id" element={<JobDescription />} />
        <Route path="*" element={<Navigate to="/" />} />

        {/* Admin Routes */}

        <Route path="/admin/companies" element={<Companies />} />
        <Route path="/admin/companies/create" element={<CreateCompany />} />
        <Route path="/admin/companies/:id" element={<SetupCompany />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/jobs/create" element={<CreateJob />} />
        <Route path="/admin/jobs/:id" element={<SetupJob />} />
        <Route path="/admin/jobs/:id/applicants" element={<Applicants />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
