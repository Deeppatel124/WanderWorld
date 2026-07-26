import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ======================
     Fetch Logged-in User
  ====================== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Token:", token);

        const res = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User Response:", res.data);

        setUser(res.data);
        setUsername(res.data.username);
        setBio(res.data.bio || "");
      } catch (err) {
        console.error("Failed to fetch user:", err);

        if (err.response) {
          console.log("Status:", err.response.status);
          console.log("Response:", err.response.data);
        } else {
          console.log(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  /* ======================
     Fetch User Blogs
  ====================== */
  useEffect(() => {
    if (!user) return;

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/blogs/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlogs();
  }, [user, token]);

  /* ======================
     Profile Image Preview
  ====================== */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ======================
     Update Profile
  ====================== */
  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);

      if (profileImage) {
        formData.append("image", profileImage);
      }

      const res = await axios.put(
        `${API_URL}/api/users/me`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);
      setEditMode(false);
      setProfileImage(null);
      setPreview(null);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  /* ======================
     Delete Blog
  ====================== */
  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`${API_URL}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-60">
        <h2 className="text-2xl font-semibold text-red-600">
          Unable to load profile
        </h2>
        <p className="text-gray-500 mt-2">
          Please log in again or check the backend API.
        </p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ================= PROFILE ================= */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={
              preview ||
              (user?.profileImage
                ? `${API_URL}/uploads/${user.profileImage}`
                : "http://localhost:5000/uploads/profileAvatar.jpg")
            }
            alt="Profile"
            className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-gray-300 shadow"
          />

          {editMode && (
            <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
              📷
            </label>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          {editMode ? (
            <>
              <input
                className="border p-2 rounded w-full mb-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <textarea
                className="border p-2 rounded w-full"
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{user?.username}</h1>
              <p className="mt-2 italic text-gray-700">
                {user?.bio || "No bio yet."}
              </p>
            </>
          )}

          <div className="mt-4 flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 text-white px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <hr className="my-8" />

      {/* ================= BLOGS ================= */}
      <h2 className="text-2xl font-semibold mb-6">My Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500">You haven’t posted any blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={`${API_URL}/uploads/${blog.image}`}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg">{blog.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {blog.content}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => navigate(`/edit/${blog._id}`)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
