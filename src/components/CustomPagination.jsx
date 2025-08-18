import React from 'react';

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
    <div className="flex items-center justify-end gap-4 w-full mt-6">
      <button
        className={`bg-[#2A2B32] border border-[#4B5563] text-[#E5E7EB] px-3 py-[6px] rounded cursor-pointer transition-all duration-200 hover:bg-[#374151] hover:border-[#ffffff3d] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#2A2B32] disabled:hover:border-[#4B5563] disabled:hover:text-[#E5E7EB]`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <div className="text-[#E5E7EB] text-sm px-3 py-[6px] bg-transparent border border-[#353835] rounded-lg">
        {currentPage}
      </div>

      <button
        className={`bg-[#2A2B32] border border-[#4B5563] text-[#E5E7EB] px-3 py-[6px] rounded cursor-pointer transition-all duration-200 hover:bg-[#374151] hover:border-[#ffffff3d] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#2A2B32] disabled:hover:border-[#4B5563] disabled:hover:text-[#E5E7EB]`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;