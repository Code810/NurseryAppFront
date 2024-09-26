import React from 'react';
import { FaAngleRight } from 'react-icons/fa6';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map(i => i + 1); // Create an array of page numbers

  return (
    <ul className="flex items-center justify-center gap-[15px] my-[70px]">
      {pages.map(page => (
        <li
          key={page}
          className={`w-15 h-15 rounded-[10px] transition-all duration-500 ${
            currentPage === page
              ? 'bg-secondary text-cream-foreground'
              : 'hover:bg-secondary text-muted-foreground hover:text-cream-foreground'
          } flex justify-center items-center border border-[#CCCCCC]`}
        >
          <button
            onClick={() => onPageChange(page)} // Handle page change on click
            className="text-2xl font-semibold leading-[140%]"
          >
            {page < 10 ? `0${page}` : page} {/* Add leading 0 for pages 1-9 */}
          </button>
        </li>
      ))}

      {/* Next button */}
      <li
        className="w-15 h-15 rounded-[10px] transition-all duration-500 hover:bg-secondary flex justify-center items-center text-muted-foreground hover:text-cream-foreground border border-[#CCCCCC]"
      >
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="text-2xl font-semibold leading-[140%]"
          disabled={currentPage >= totalPages}
        >
          <FaAngleRight />
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
