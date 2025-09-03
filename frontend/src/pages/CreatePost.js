import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackToHomeButton from "../components/BackToHomeButton";

const CreatePost = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (image) data.append("image", image);

    try {
      await axios.post(
        "https://wanderworld-production-4b52.up.railway.app/api/blogs",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate(`/profile/${JSON.parse(localStorage.getItem("user"))._id}`);
    } catch (err) {
      setError("Failed to post blog");
    }
  };

  return (
    <div
      className="container py-2"
      style={{ backgroundColor: "#f8f9fa", minHeight: "80vh" }}
    >
      <BackToHomeButton />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow p-4 border-0">
            <h2
              className="mb-4 text-center"
              style={{ fontWeight: "700", color: "#0d6efd" }}
            >
              Share Your Travel Story
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter blog title"
                  value={formData.title}
                  style={{ fontSize: "1.1rem", height: "55px" }}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control"
                  rows="7"
                  style={{ fontSize: "1.05rem" }}
                  placeholder="Write your experience..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <button className="btn btn-success w-100 fw-bold">
                Create Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
