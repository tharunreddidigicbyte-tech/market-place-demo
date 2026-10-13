import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Pagination = ({ currentPage, totalPages, hasNext, hasPrev, nextPage, prevPage, goToPage, startIndex, endIndex, totalItems }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {startIndex}–{endIndex} of {totalItems}
      </span>
      <div className="pagination-controls">
        <button
          className="page-btn"
          onClick={prevPage}
          disabled={!hasPrev}
          aria-label="Previous page"
        >
          <FontAwesomeIcon icon="angle-left" />
        </button>
        {getPages().map((page, i) =>
          page === '...'
            ? <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
            : <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => goToPage(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
        )}
        <button
          className="page-btn"
          onClick={nextPage}
          disabled={!hasNext}
          aria-label="Next page"
        >
          <FontAwesomeIcon icon="angle-right" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
