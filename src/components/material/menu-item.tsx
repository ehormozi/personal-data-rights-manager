'use client';

import React from 'react';

export default function MenuItems(props: {
  label: string;
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  if (props.onClick) {
    return (
      <a
        href={props.href}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:outline-none"
        role="menuitem"
        tabIndex={-1}
        onClick={props.onClick}
      >
        {props.label}
      </a>
    );
  } else {
    return (
      <a
        href={props.href}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:outline-none"
        role="menuitem"
        tabIndex={-1}
      >
        {props.label}
      </a>
    );
  }
}
