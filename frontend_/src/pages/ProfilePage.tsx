import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { getMe, patchMeUser, patchMeProfile } from "../services/auth";

const BASE_URL = "http://127.0.0.1:8000";

interface FormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  location: string;
  profile_picture: File | null;
  preview_picture_url?: string;
}

export default function ProfilePage() {
  const { refreshMe } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    profile_picture: null,
    preview_picture_url: undefined,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setUserData(data);
        setForm({
          username: data.username,
          email: data.email,
          first_name: data.profile.first_name || "",
          last_name: data.profile.last_name || "",
          bio: data.profile.bio || "",
          location: data.profile.location || "",
          profile_picture: null,
          preview_picture_url: undefined,
        });
      } catch (_) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


const handleUpdate = async () => {
  setSaving(true);
  setError("");
  try {
    await patchMeUser({
      username: form.username,
      email: form.email,
    });

    await patchMeProfile({
      first_name: form.first_name,
      last_name: form.last_name,
      bio: form.bio,
      location: form.location,
      profile_picture: form.profile_picture,
    });

    await refreshMe();

    const updated = await getMe();
    setUserData(updated);
    setEditing(false);
  } catch (_) {
    setError("Failed to update profile.");
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)] px-4">
          <div className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-8 flex flex-col items-center gap-4 border border-gray-700">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium animate-pulse">Loading profile…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <Navbar />
      <div className="px-4 py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!editing ? (
  // --- View Mode ---
  <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-gray-700 hover:shadow-xl transition-shadow">
    <div className="flex items-center gap-6 mb-8">
      <img
        src={
          userData?.profile?.profile_picture_url?.trim()
            ? userData.profile.profile_picture_url
            : "/default-avatar.png"
        }
        onError={(e) => {
          e.currentTarget.src = "/default-avatar.png";
        }}
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
      />
      <div>
        <h2 className="text-2xl font-semibold">{userData?.username}</h2>
        <p className="text-sm text-gray-400">{userData?.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6 text-sm text-gray-300">
      <div>
        <span className="font-semibold text-white block mb-1">First Name</span>
        {userData?.profile?.first_name || "—"}
      </div>
      <div>
        <span className="font-semibold text-white block mb-1">Last Name</span>
        {userData?.profile?.last_name || "—"}
      </div>
      <div>
        <span className="font-semibold text-white block mb-1">Location</span>
        {userData?.profile?.location || "—"}
      </div>
      <div>
        <span className="font-semibold text-white block mb-1">Role</span>
        {userData?.profile?.role || "—"}
      </div>
      <div className="col-span-2">
        <span className="font-semibold text-white block mb-1">Bio</span>
        {userData?.profile?.bio || "—"}
      </div>
    </div>

    {/* Button Row */}
    <div className="mt-8 flex gap-4">
      <button
        onClick={() => setEditing(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Edit Profile
      </button>

      <button
        onClick={() => {
          // Navigate to change password page
          window.location.href = "/me/change-password";
        }}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Change Password
      </button>
    </div>
  </div>
) : (

          // --- Edit Mode ---
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-gray-700 space-y-6">
            {/* Profile Picture Preview - Centered at Top */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <img
                src={
                  form.preview_picture_url ||
                  userData?.profile?.profile_picture_url ||
                  "/default-avatar.png"
                }
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg cursor-pointer transition-colors">
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setForm((prev) => ({
                      ...prev,
                      profile_picture: file,
                      preview_picture_url: file
                        ? URL.createObjectURL(file)
                        : prev.preview_picture_url,
                    }));
                  }}
                />
              </label>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <label className="text-gray-300 font-medium">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="text-gray-300 font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="text-gray-300 font-medium">First Name</label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="text-gray-300 font-medium">Last Name</label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="text-gray-300 font-medium">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full h-28 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4 justify-center">
              <button
  onClick={handleUpdate}
  disabled={saving}
  className={`${
    saving ? "bg-green-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
  } text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2`}
>
  {saving && (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
  {saving ? "Saving..." : "Save Changes"}
</button>

              <button
                onClick={() => setEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 InternLink. All rights reserved.
      </footer>
    </div>
  );
}
