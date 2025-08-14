import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const role = user?.profile?.role;


  const commonLinks = (
    <>
      <a href="/For-Students/" className="hover:text-blue-600">Student Opportunities</a>
      <a href="/For-Companies/" className="hover:text-blue-600">Hire Engineers</a>
      <a href="/How-It-Works/" className="hover:text-blue-600">Platform Overview</a>
    </>
  );

  const studentLinks = (
    <>
      <Link to="/internships/" className="hover:text-blue-600">Internships</Link>
      <Link to="/applications/mine/" className="hover:text-blue-600">My Applications</Link>
      <Link to="/bookmarks/list/" className="hover:text-blue-600">Bookmarks</Link>
      <Link to="/activity_logs/" className="hover:text-blue-600">My Activity</Link>
    </>
  );

  const recruiterLinks = (
    <>
      <Link to="/internships/" className="hover:text-blue-600">Internships</Link>
      <Link to="/internships/mine/" className="hover:text-blue-600">My Jobs</Link>
      <Link to="/internships/create/" className="hover:text-blue-600">Post Jobs</Link>
      <Link to="/activity_logs/" className="hover:text-blue-600">My Activity</Link>
    </>
  );

  return (
    <header
  className={`sticky top-0 z-50 backdrop-blur-md bg-gray/60 transition-shadow ${
    isScrolled ? "shadow-md border-b border-gray-700" : ""
  }`}
>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold flex items-center gap-1">
              🌟 <span>InternLink</span>
            </Link>

            <nav className="hidden md:flex gap-6 text-base font-medium">
              {!user && commonLinks}
              {user && role === "student" && studentLinks}
              {user && role === "recruiter" && recruiterLinks}
            </nav>
          </div>


          {/* Right: Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
  onClick={() => setShowProfileMenu(!showProfileMenu)}
  className="flex flex-col items-center gap-1"
>
  <img
    src={
      user?.profile?.profile_picture_url
        ? user.profile.profile_picture_url
        : "/default-avatar.png"
    }
    alt="Profile"
    className="w-8 h-8 rounded-full object-cover border border-gray-300"
  />

  <span className="text-xs font-medium hover:text-blue-600">
  </span>
</button>


                {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-transparent border rounded shadow-lg py-1 z-50">
                  <Link
                    to="/me/profile/"
                    className="block px-4 py-2 text-base hover:bg-gray-100 hover:text-black"
                  >
                    Account Settings
                  </Link>
                  <Link
  to="/me/change-password"
  className="block px-4 py-2 text-base hover:bg-gray-100 hover:text-black"
>
  Change Password
</Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-base hover:bg-gray-100 hover:text-black"
                  >
                    Logout
                  </button>
                </div>
              )}

              </div>
            ) : (
              <Link to="/login" className="text-base font-medium hover:text-blue-600">Login</Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-2 text-base font-medium">
            {!user && commonLinks}
            {user && role === "student" && studentLinks}
            {user && role === "recruiter" && recruiterLinks}
            {user ? (
              <>
                <Link to="/me/profile/" className="hover:text-blue-600">Account Settings</Link>
                <button onClick={logout} className="text-left hover:text-blue-600">Logout</button>
              </>
            ) : (
              <Link to="/login" className="hover:text-blue-600">Login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}