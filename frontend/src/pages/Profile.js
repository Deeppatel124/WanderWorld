import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchUserBlogs = async () => {
    try {
      const res = await axios.get(`https://wanderworld-production-4b52.up.railway.app/api/blogs/user/${id}`);
      setBlogs(res.data);
      if (res.data.length > 0) {
        setUser(res.data[0].user);
      } else {
        const userRes = await axios.get(`https://wanderworld-production-4b52.up.railway.app/api/users/${id}`);
        setUser(userRes.data);
      }
    } catch (err) {
      setError('Failed to load profile.');
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`https://wanderworld-production-4b52.up.railway.app/api/blogs/${postId}`, {
          headers: {
            Authorization:  `Bearer ${token}`
          }
        });
        setBlogs((prev) => prev.filter((b) => b._id !== postId));
      } catch (err) {
        alert('Failed to delete the post');
      }
    }
  };

  useEffect(() => {
    fetchUserBlogs();
  }, [id]);

  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2
  className="text-center mb-5"
  style={{
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#0d6efd',
    fontFamily: 'Georgia, serif',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  }}
>
  Posts by {user ? user.username : 'Loading...'}
</h2>

        </div>

        <div className="text-start mb-3">
          <Link to="/" className="btn btn-outline-dark">← Back to Home</Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          {blogs.length === 0 && (
            <p className="text-muted text-center">No posts available.</p>
          )}

          {blogs.map((blog) => (
            <div key={blog._id} className="col-md-4">
              <div className="card shadow-sm h-100">
                {blog.image && (
                  <img
                    src={`https://wanderworld-production-4b52.up.railway.app/uploads/${blog.image}`}
                    className="card-img-top"
                    alt="Blog"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-dark">{blog.title}</h5>
                  <p className="card-text text-secondary">{blog.description.slice(0, 100)}...</p>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="btn btn-sm btn-outline-success"
                    >
                      Read More →
                    </Link>

                    {loggedInUser?._id === blog.user?._id && (
                      <div className="btn-group">
                        <Link
                          to={`/edit/${blog._id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
