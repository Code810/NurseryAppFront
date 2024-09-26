import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Logo = ({ className,logo }) => {
  return (
    <Link to="/" className="flex items-center gap-1">
      {logo && (
        <img
          src={`${logo.value}`}
          alt="Logo"
          width={200}
        />
      )}
      <span className={cn("font-bold text-3xl", className)}></span>
    </Link>
  );
};

export default Logo;
