import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { getMe, patchMeUser, patchMeProfile } from "../services/auth";

const BASE_URL = "http://127.0.0.1:8000";

export default function ProfilePage() {
  const { refreshMe } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    profile_picture: null as File | null,
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
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading profile…
      </div>
    );
  }
  console.log(userData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <Navbar />
      <div className="px-4 py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {!editing ? (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-6 mb-6">
              <img
                src={
                    userData?.profile?.profile_picture
                    ? `${BASE_URL}${userData.profile.profile_picture}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-white"
              />
              <div>
                <h2 className="text-xl font-semibold">{userData?.username}</h2>
                <p className="text-sm text-gray-400">{userData?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <p><span className="font-semibold text-white">First Name:</span> {userData?.profile?.first_name || "—"}</p>
              <p><span className="font-semibold text-white">Last Name:</span> {userData?.profile?.last_name || "—"}</p>
              <p><span className="font-semibold text-white">Location:</span> {userData?.profile?.location || "—"}</p>
              <p><span className="font-semibold text-white">Role:</span> {userData?.profile?.role}</p>
              <p className="col-span-2"><span className="font-semibold text-white">Bio:</span> {userData?.profile?.bio || "—"}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="First Name"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, profile_picture: e.target.files?.[0] || null })
                }
                className="bg-gray-700 text-white px-4 py-2 rounded"
              />
            </div>
            <textarea
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="bg-gray-700 text-white px-4 py-2 rounded w-full h-24"
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
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