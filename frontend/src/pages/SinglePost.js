import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BackToHomeButton from '../components/BackToHomeButton';

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setPost(res.data);
      } catch (err) {
        setError('Failed to load post.');
      }
    };
    fetchPost();
  }, [id]);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">Loading post...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '60px' }}>
      <div className="container">
        <BackToHomeButton /> {/* ✅ Left-aligned Home button */}

        <div className="card p-4 shadow-sm border-0 mx-auto mt-3" style={{ maxWidth: '800px' }}>
          {post.image && (
            <img
              src={`http://localhost:5000/uploads/${post.image}`}
              alt="blog"
              className="card-img-top mb-4"
              style={{ maxHeight: '400px', objectFit: 'cover', borderRadius: '5px' }}
            />
          )}
          <h2 className="fw-bold text-dark">{post.title}</h2>
          <p className="text-muted mb-1">
            By{' '}
            <Link
              to={`/profile/${post.user?._id}`}
              className="text-decoration-none fw-semibold"
              style={{ color: '#0d6efd' }}
            >
              {post.user?.username || 'User'}
            </Link>
          </p>
          <hr />
          <p style={{ fontSize: '1.1rem', color: '#343a40', lineHeight: '1.7' }}>
            {post.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
