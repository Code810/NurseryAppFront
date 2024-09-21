import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaXTwitter, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { cn } from '@/lib/utils';

const SocalIcons = ({ className, prentClass, facebook, twitter, linkedin, instagram }) => {
  const icons = [
    { id: 1, link: facebook, icon: <FaFacebookF /> },
    { id: 2, link: twitter, icon: <FaXTwitter /> },
    { id: 3, link: linkedin, icon: <FaLinkedin /> },
    { id: 4, link: instagram, icon: <FaInstagram /> },
  ];

  return (
    <ul className={cn("flex items-center gap-[14px]", prentClass)}>
      {icons.map(({ icon, id, link }) =>
        link && (
          <li key={id}>
            <Link
              to={link}
              className={cn(
                'rounded-md w-6 h-6 flex items-center justify-center border border-white border-opacity-20 text-cream-foreground hover:bg-primary transition-all duration-500',
                className
              )}
            >
              {icon}
            </Link>
          </li>
        )
      )}
    </ul>
  );
};

export default SocalIcons;
