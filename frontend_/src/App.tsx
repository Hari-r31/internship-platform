import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import RegisterPage from "./pages/auth/RegisterPage";
import HowItWorksPage from "./components/HowItworksPage";
import ForStudents from "./components/ForStudents";
import ForCompanies from "./components/ForCompanies";
import NotFound from "./pages/NotFound";

// Student pages
import Bookmarks from "./pages/BookmarksList";
import StudentApplications from "./pages/ApplicationList";

// Recruiter pages

import PostInternship from "./pages/PostInternship";
import RecruiterPostedList from "./pages/RecrutierPostedList";
import EditInternshipPage from "./pages/EditInternshipPage";
import ApplicantsListPage from "./pages/ApplicantsListPage";

// Shared protected pages
import ActivityLogPage from "./pages/ActivityLogPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePassword from "./pages/ChangePassword";

// Internship-related pages
import InternshipList from "./pages/InternshipsList";
import InternshipDetail from "./pages/InternshipDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/How-It-Works" element={<HowItWorksPage />} />
        <Route path="/For-Students" element={<ForStudents />} />
        <Route path="/For-Companies" element={<ForCompanies />} />
        <Route path="/internships" element={<InternshipList />} />
        <Route path="/internships/:id/view" element={<InternshipDetail />} />

        {/* Student-only routes */}
        <Route path="/bookmarks/list/" element={<ProtectedRoute allowedRoles={["student"]}><Bookmarks /></ProtectedRoute>} />
        <Route path="/applications/mine/" element={<ProtectedRoute allowedRoles={["student"]}><StudentApplications /></ProtectedRoute>} />
        <Route path="/applications/apply/" element={<InternshipDetail />} />


        {/* Recruiter-only routes */}
        <Route path="/internships/create/" element={<ProtectedRoute allowedRoles={["recruiter"]}><PostInternship /></ProtectedRoute>} />
        <Route path="/internships/mine/" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterPostedList /></ProtectedRoute>} />
        <Route path="/internships/:id/edit/" element={<ProtectedRoute allowedRoles={["recruiter"]}><EditInternshipPage /></ProtectedRoute>} />
        <Route path="/internships/:internship_id/applicants" element={<ProtectedRoute allowedRoles={["recruiter"]}><ApplicantsListPage /></ProtectedRoute>} />


        {/* Shared protected routes (student + recruiter) */}
        <Route path="/activity_logs/" element={<ProtectedRoute allowedRoles={["student", "recruiter"]}><ActivityLogPage /></ProtectedRoute>} />
        <Route path="/me/profile/" element={<ProtectedRoute allowedRoles={["student", "recruiter"]}><ProfilePage /></ProtectedRoute>} />
        <Route path="/me/change-password" element={<ProtectedRoute allowedRoles={["student", "recruiter"]}><ChangePassword /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
