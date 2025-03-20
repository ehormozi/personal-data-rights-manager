import {
  ExclamationTriangleIcon,
  LockClosedIcon,
  LockOpenIcon,
  WrenchScrewdriverIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  UserIcon,
  KeyIcon,
  EyeIcon,
  FolderArrowDownIcon,
  InboxIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Key, ReactNode } from 'react';
import { cookies } from 'next/headers';

import Widget from '../material/widget';
import WhiteBox from '../material/white-box';
import Button from '../material/button';

const iconByType: Record<string, ReactNode> = {
  data_breach: <ExclamationTriangleIcon className="h-6 w-6" />,
  data_viewed: <DocumentTextIcon className="h-6 w-6" />,
  export_data: <FolderArrowDownIcon className="h-6 w-6" />,
  grant: <LockOpenIcon className="h-6 w-6" />,
  import_data: <InboxIcon className="h-6 w-6" />,
  modify: <WrenchScrewdriverIcon className="h-6 w-6" />,
  new_service_access: <PlusIcon className="h-6 w-6" />,
  notification_read: <EyeIcon className="h-6 w-6" />,
  password_changed: <KeyIcon className="h-6 w-6" />,
  pending_request: <ClockIcon className="h-6 w-6" />,
  profile_updated: <UserIcon className="h-6 w-6" />,
  request_completed: <CheckCircleIcon className="h-6 w-6" />,
  request_created: <EnvelopeIcon className="h-6 w-6" />,
  request_updated: <ArrowPathIcon className="h-6 w-6" />,
  revoke: <LockClosedIcon className="h-6 w-6" />,
};

const colorByGroup: Record<string, ReactNode> = {
  'Alerts and Notifications': 'bg-yellow-100 text-yellow-800',
  'Data Rights Request': 'bg-green-100 text-green-800',
  General: 'bg-gray-100 text-gray-800',
  'Permission Management': 'bg-blue-100 text-blue-800',
  'System or User Settings': 'bg-gray-100 text-gray-800',
};

function formattedDifference(time: string) {
  var seconds = Math.floor(
    (new Date(Date.now()).getTime() - new Date(time).getTime()) / 1000,
  );
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  if (days === 1) {
    return days + ' day ago';
  } else if (days > 1) {
    return days + ' days ago';
  } else if (hours === 1) {
    return hours + ' hour ago';
  } else if (hours > 1) {
    return hours + ' hours ago';
  } else if (minutes === 1) {
    return minutes + ' minute ago';
  } else if (minutes > 1) {
    return minutes + ' minutes ago';
  } else if (seconds === 1) {
    return seconds + ' second ago';
  } else {
    return seconds + ' seconds ago';
  }
}

export default async function RecentActivity() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const response = await fetch('http://localhost:3001/api/recent-activity', {
    method: 'GET',
    credentials: 'include',
    headers: { Cookie: `connect.sid=${sessionCookie}` },
  });
  if (response.status === 200) {
    const data = await response.json();
    return (
      <Widget title="Recent Activity">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {data.map(
            (
              element: {
                group: string;
                type: string;
                description: string;
                time: string;
                service: string | null;
              },
              index: Key,
            ) => (
              <WhiteBox
                key={index}
                className="flex p-2 justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={
                      'p-2 bg-blue-100 rounded-full ' +
                      colorByGroup[element.group]
                    }
                  >
                    {iconByType[element.type]}
                  </span>
                  <p className="text-gray-700 text-sm">
                    {element.service
                      ? element.description.replaceAll(
                          '[Service Name]',
                          element.service,
                        )
                      : element.description}
                  </p>
                </div>
                <div className="ml-2 text-right text-xs text-gray-500 whitespace-nowrap">
                  {formattedDifference(element.time)}{' '}
                </div>
              </WhiteBox>
            ),
          )}
        </div>
        <Button
          text="View Full Activity Log"
          color="bg-blue-600"
          hover="hover:bg-blue-700"
          className="w-full mt-4"
        />
      </Widget>
    );
  }
}
