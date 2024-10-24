import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MenuNavItem = ({ text, path, Icon,state }) => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <NavLink
      end
      to={path}
      state={state}
      className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
        pathname.includes(path) ? "" : "hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="grow flex items-center">
          {Icon && <Icon className="text-[#ed145b] text-[22px]" />}
          <span className="text-sm font-bold ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
            {text}
          </span>
        </div>
      </div>
    </NavLink>
  );
};

export default MenuNavItem;
