import React, { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BackToHomeButton from '../components/BackToHomeButton';

const UserProfile = () => {
  const { id } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // ✅ Scroll to top BEFORE the DOM paints
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
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
        setError('Failed to load user profile.');
      }
    };

    fetchUserBlogs();
  }, [id]);

  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <BackToHomeButton />

        {error && <div className="alert alert-danger">{error}</div>}

        <h2 className="mb-4 text-center" style={{ fontSize: '2rem', fontWeight: '700', color: '#0d6efd' }}>
          Posts by {user ? user.username : 'Loading...'}
        </h2>

        <div className="row g-4">
          {blogs.length === 0 ? (
            <p className="text-muted text-center">No posts available.</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="col-md-4">
                <div className="card shadow-sm h-100">
                  {blog.image && (
                    <img
                      src={`https://wanderworld-production-4b52.up.railway.app/uploads/${blog.image}`}
                      className="card-img-top"
                      alt="Blog"
                      style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => window.location.href = `/blog/${blog._id}`}
                    />
                  )}
                  <div className="card-body">
                    <h5
                      className="card-title fw-bold text-dark"
                      style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                      onClick={() => window.location.href = `/blog/${blog._id}`}
                    >
                      {blog.title}
                    </h5>
                    <p
                      style={{ color: '#212529', cursor: 'pointer' }}
                      onClick={() => window.location.href = `/blog/${blog._id}`}
                    >
                      {blog.description.slice(0, 100)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">{user?.username}</span>
                      <Link
                        to={`/blog/${blog._id}`}
                        className="btn btn-sm btn-outline-success"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
