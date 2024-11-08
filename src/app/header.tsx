import { Disclosure } from '@headlessui/react';
import MobileMenuButton from './mobile-menu-button';
import CompanyLogo from './company-logo';
import TopNavigation from './top-navigation';
import MobileMenu from './mobile-menu';
import NotificationsIcon from './notifications-icon';
import ProfileDropdown from './profile-dropdown';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <MobileMenuButton />
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <CompanyLogo />
            <TopNavigation navigation={navigation} classNames={classNames} />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <NotificationsIcon />
            <ProfileDropdown />
          </div>
        </div>
      </div>
      <MobileMenu navigation={navigation} classNames={classNames} />
    </Disclosure>
  );
}
