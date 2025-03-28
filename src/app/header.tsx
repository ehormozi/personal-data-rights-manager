'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/auth-context';

import { useLoading } from '@/context/loading-context';

import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
} from '@headlessui/react';

import TopNavigation from './dashboard/components/server/top-navigation';
import MenuItem from '@/components/client/menu-item';
import LoadingSpinner from '@/components/server/loading-spinner';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type HeaderProps = {
  currentPage: string;
};

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      current: currentPage === 'dashboard',
    },
    {
      name: 'Permissions',
      href: '/permissions',
      current: currentPage === 'permissions',
    },
    {
      name: 'Requests',
      href: '/requests',
      current: currentPage === 'requests',
    },
    {
      name: 'Activity Log',
      href: '/activity-log',
      current: currentPage === 'activity-log',
    },
    {
      name: 'Help & Support',
      href: '/help-support',
      current: currentPage === 'help-support',
    },
  ];

  const [showMenuItems, setShowMenuItems] = useState<boolean>(false);

  const router = useRouter();

  const { user, logout } = useAuth();

  const { isLoading, setIsLoading } = useLoading();

  const handleLogout: any = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await logout().then(() => router.push('/login'));
    } catch (error: any) {
    } finally {
      setShowMenuItems(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Disclosure as="nav" className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt="Company Logo"
                    src="Logo.png"
                    className="h-8 w-auto"
                  />
                }
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <a
                    key="Personal Data Rights Manager"
                    href="#"
                    className={classNames(
                      'text-white',
                      'rounded-md px-3 py-2 text-lg font-medium',
                    )}
                  >
                    Personal Data Rights Manager
                  </a>
                </div>
              </div>
              <TopNavigation navigation={navigation} classNames={classNames} />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton
                    className={`relative
                      flex
                      rounded-full
                      bg-gray-800
                      text-gray-400
                      hover:text-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-white
                      focus:ring-offset-2
                      focus:ring-offset-gray-800
                      ${user?.profile_photo_url ? '' : 'p-1'}`}
                    onClick={() => setShowMenuItems(!showMenuItems)}
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {
                      /* eslint-disable @next/next/no-img-element */
                      user?.profile_photo_url ? (
                        <img
                          src={'uploads/' + user?.profile_photo_url}
                          alt="Profile"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon aria-hidden="true" className="h-6 w-6" />
                      )
                    }
                  </MenuButton>
                </div>
                {showMenuItems && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    role="menu"
                    tabIndex={0}
                    data-open=""
                  >
                    <MenuItem
                      label="Profile & Security"
                      href="/profile-security"
                    ></MenuItem>
                    <MenuItem
                      label="Sign out"
                      href="#"
                      onClick={handleLogout}
                    ></MenuItem>
                  </div>
                )}
              </Menu>
            </div>
          </div>
        </div>
        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};

export default Header;
