import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import SinglePost from './pages/SinglePost';
import BlogDetails from './pages/BlogDetails';
import UserProfile from './pages/UserProfile';
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const token = localStorage.getItem('token');

  return (
    <>
      {/* Hide navbar only on auth page */}
      {location.pathname !== '/auth' && (
        <Navbar onSearch={setSearchQuery} />
      )}

      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/create"
          element={token ? <CreatePost /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/edit/:id"
          element={token ? <EditPost /> : <Navigate to="/auth" replace />}
        />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
