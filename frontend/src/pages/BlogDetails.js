import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import BackToHomeButton from "../components/BackToHomeButton";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `https://wanderworld-production-4b52.up.railway.app/api/blogs/${id}`
        );
        setBlog(res.data);
      } catch (err) {
        setError("Failed to load blog details.");
      }
    };
    fetchBlog();
  }, [id]);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">Loading blog...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "60px",
      }}
    >
      <div className="container">
        <BackToHomeButton />

        <div
          className="card p-4 shadow-sm border-0 mx-auto mt-3"
          style={{ maxWidth: "800px" }}
        >
          {blog.image && (
            <img
              src={`https://wanderworld-production-4b52.up.railway.app/uploads/${blog.image}`}
              alt="blog"
              className="card-img-top mb-4"
              style={{
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
          )}

          <h2 className="fw-bold text-dark mb-2">{blog.title}</h2>

          <p className="text-muted mb-2">
            By{" "}
            <img
              src={`https://wanderworld-production-4b52.up.railway.app/uploads/profileAvatar.jpg`}
              alt="user"
              style={{
                maxHeight: "50px",
                width:'50px',
              }}
            />
            <Link
              to={`/profile/${blog.user?._id}`}
              className="text-decoration-none fw-semibold"
              style={{ color: "#0d6efd" }}
            >
              {blog.user?.username || "User"}
            </Link>
          </p>

          <hr />

          <p
            style={{ fontSize: "1.1rem", color: "#343a40", lineHeight: "1.7" }}
          >
            {blog.description}
          </p>

          <h3>Comments</h3>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
