import React from 'react';

const Card = ({ children, className = '', hover = true, glass = false, padding = true, onClick }) => {
  return (
    <div
      className={`card ${glass ? 'card--glass' : ''} ${hover ? 'card--hover' : ''} ${padding ? '' : 'card--no-pad'} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
