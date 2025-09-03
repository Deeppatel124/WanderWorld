import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

const Home = ({ searchQuery }) => {
  const [blogs, setBlogs] = useState([]);

  // Fetch all blogs from the backend
  const fetchAllBlogs = async () => {
    try {
      const res = await axios.get(
        "https://wanderworld-production-4b52.up.railway.app/api/blogs"
      );
      setBlogs(res.data);
    } catch (err) {
      console.error("Home fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  // Filter blogs based on search query (title or username)
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80') no-repeat center center/cover`,
          color: "white",
          padding: "100px 0",
          textAlign: "center",
        }}
      >
        <h1 className="display-4 fw-bold">Welcome to WanderWorld</h1>
        <p className="lead">
          Discover amazing places shared by fellow travelers
        </p>
      </div>

      {/* Blog Cards Section */}
      <div className="container my-5">
        <div className="row g-4">
          {filteredBlogs.length === 0 ? (
            <p className="text-muted text-center">No posts available.</p>
          ) : (
            filteredBlogs.map((blog) => (
              <div key={blog._id} className="col-md-4">
                <BlogCard blog={blog} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
