import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <div
      className="card shadow-sm h-100 blog-card"
      style={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      }}
    >
      {/* Blog Image & Content */}
      <Link
        to={`/blog/${blog._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {blog.image && (
          <img
            src={`http://localhost:5000/uploads/${blog.image}`}
            className="card-img-top"
            alt="blog"
            style={{ height: "200px", objectFit: "cover" }}
          />
        )}

        <div className="card-body">
          <h5
            className="card-title fw-bold text-dark"
            style={{ fontSize: "1.2rem" }}
          >
            {blog.title}
          </h5>

          <p
            className="card-text mt-2"
            style={{ fontSize: "0.95rem", color: "#212529" }}
          >
            {blog.description.slice(0, 100)}...
          </p>
        </div>
      </Link>

      {/* Footer */}
      <div className="d-flex justify-content-between align-items-center px-3 pb-3">
        <Link
          to={`/user/${blog.user?._id}`}
          className="text-decoration-none d-flex align-items-center"
          style={{ color: "#343a40" }}
        >
          <img
            src={
              blog.user?.profileImage
                ? `http://localhost:5000/uploads/${blog.user.profileImage}`
                : "http://localhost:5000/uploads/profileAvatar.jpg"
            }
            alt="Profile"
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "8px",
              border: "2px solid #ddd",
            }}
          />

          <span style={{ fontWeight: "500", fontSize: "1rem" }}>
            {blog.user?.username || "User"}
          </span>
        </Link>

        <Link
          to={`/blog/${blog._id}`}
          className="text-decoration-none"
          style={{
            color: "#0d6efd",
            fontWeight: "500",
            fontSize: "0.95rem",
          }}
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;