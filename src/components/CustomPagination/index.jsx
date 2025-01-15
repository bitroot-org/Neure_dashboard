import React from 'react';
import './index.css';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="custom-pagination">
      <button 
        className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      
      <div className="page-numbers">
        {currentPage}
      </div>
      
      <button 
        className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;