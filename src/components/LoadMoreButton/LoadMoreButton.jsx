import React from 'react';
import './LoadMoreButton.css';

const LoadMoreButton = ({ onClick, loading = false }) => {
  return (
    <button 
      className="load-more-btn" 
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <>
          <div className="btn-spinner"></div>
          Loading...
        </>
      ) : (
        'Load More Questions'
      )}
    </button>
  );
};

export default LoadMoreButton;
