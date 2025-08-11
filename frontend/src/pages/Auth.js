import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setForm({ username: '', email: '', password: '' });
    setMessage('');
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: form.email,
          password: form.password,
        });

        const existingUser = JSON.parse(localStorage.getItem('user'));
        if (existingUser && existingUser.email === form.email) {
          return setError('You are already logged in with this email. Please logout first.');
        }

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      } else {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
          username: form.username,
          email: form.email,
          password: form.password,
        });

        setMessage(res.data.message || 'Registered successfully. Please login.');
        setIsLogin(true);
        setForm({ username: '', email: '', password: '' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
    }
  };

  return (
    <div className="bg-light d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '420px' }}>
        <h2 className="text-center mb-3 text-primary">{isLogin ? 'Login' : 'Register'}</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label>Username : </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label>Email : </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label>Password : </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          <button className="btn btn-primary w-100 mt-2">{isLogin ? 'Login' : 'Register'}</button>
        </form>

        <div className="text-center mt-3">
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button className="btn btn-link p-0" onClick={handleToggle}>
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button className="btn btn-link p-0" onClick={handleToggle}>
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
