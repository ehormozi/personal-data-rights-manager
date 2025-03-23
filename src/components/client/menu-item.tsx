'use client';

import React from 'react';

type MenuItemsProps = {
  label: string;
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const MenuItems: React.FC<MenuItemsProps> = ({ label, href, onClick }) => {
  if (onClick) {
    return (
      <a
        href={href}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:outline-none"
        role="menuitem"
        tabIndex={-1}
        onClick={onClick}
      >
        {label}
      </a>
    );
  } else {
    return (
      <a
        href={href}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:outline-none"
        role="menuitem"
        tabIndex={-1}
      >
        {label}
      </a>
    );
  }
};

export default MenuItems;
