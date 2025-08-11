import React from 'react';
import { Link } from 'react-router-dom';

const BackToHomeButton = () => {
  return (
    <div className="mb-3">
      <Link to="/" className="btn btn-outline-primary">
        ← Back to Home
      </Link>
    </div>
  );
};

export default BackToHomeButton;
