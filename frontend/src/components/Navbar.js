import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isAuthPage = location.pathname === '/auth';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 shadow-sm">
      <div className="container-fluid">
        {/* Website Name */}
        <Link className="navbar-brand fw-bold text-primary" to="/" style={{ fontSize: '1.5rem' }}>
          WanderWorld
        </Link>

        {/* Search Box in center - hidden on /auth */}
        {!isAuthPage && (
          <form className="d-none d-md-flex mx-auto" style={{ width: '40%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by title or username"
              onChange={(e) => onSearch(e.target.value)}
            />
          </form>
        )}

        {/* Navbar Buttons */}
        <div className="d-flex align-items-center gap-3">
          <Link className="btn btn-outline-dark btn-sm" to="/">
            Home
          </Link>

          {token ? (
            <>
              <Link className="btn btn-outline-success btn-sm" to="/create">
                Create
              </Link>
              <Link className="btn btn-outline-primary btn-sm" to={`/profile/${user?._id}`}>
                My Profile
              </Link>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn btn-primary btn-sm" to="/auth">
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
