import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <div
      className="card shadow-sm h-100 blog-card"
      style={{
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
    >
      <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {blog.image && (
          <img
            src={`https://wanderworld-production-4b52.up.railway.app/uploads/${blog.image}`}
            className="card-img-top"
            alt="blog"
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}
        <div className="card-body">
          <h5 className="card-title fw-bold text-dark" style={{ fontSize: '1.2rem' }}>
            {blog.title}
          </h5>
          <p className="card-text mt-2" style={{ fontSize: '0.95rem', color: '#212529' }}>
            {blog.description.slice(0, 100)}...
          </p>
        </div>
      </Link>

      <div className="d-flex justify-content-between align-items-center px-3 pb-3">
        <Link
          to={`/profile/${blog.user?._id}`}
          className="text-decoration-none"
          style={{ fontWeight: '500', fontSize: '1rem', color: '#343a40' }}
        >
          <img
            src={`https://wanderworld-production-4b52.up.railway.app/public/images/userImage.png`} alt='User' style={{ height: '50px', width:'50px' }}
          />By {blog.user?.username || 'User'}
        </Link>
        <Link
          to={`/blog/${blog._id}`}
          className="text-decoration-none"
          style={{ color: '#0d6efd', fontWeight: '500', fontSize: '0.95rem' }}
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
