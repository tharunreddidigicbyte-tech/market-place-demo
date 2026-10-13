import React from 'react';

const Badge = ({ label, color = 'gold', size = 'sm', className = '' }) => {
  return (
    <span className={`badge badge-${color} badge-${size} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
