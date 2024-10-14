import React from 'react';

const Status = ({ icon, text, className }) => {
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${className}`}>
      {icon && (
        <span className="icon">
          {icon}
        </span>
      )}
      <h2 className="text-sm font-normal">{text}</h2>
    </div>
  );
};

export default Status;