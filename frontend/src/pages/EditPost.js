import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackToHomeButton from "../components/BackToHomeButton";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `https://wanderworld-production-4b52.up.railway.app/api/blogs/${id}`
        );
        setFormData({
          title: res.data.title,
          description: res.data.description,
        });
      } catch (err) {
        setError("Failed to load blog data");
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (image) data.append("image", image);

    try {
      await axios.put(
        `https://wanderworld-production-4b52.up.railway.app/api/blogs/${id}`,
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
      setError("Failed to update blog");
    }
  };

  return (
    <div
      className="container py-5"
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
              Edit Your Travel Story
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control"
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Update Image (optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <button className="btn btn-success w-100 fw-bold">
                Update Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
