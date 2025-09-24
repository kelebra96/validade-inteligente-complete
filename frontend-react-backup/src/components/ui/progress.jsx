import React from 'react';

export const Progress = ({ value = 0, className = '', ...props }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div 
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
      {...props}
    >
      <div 
        className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};