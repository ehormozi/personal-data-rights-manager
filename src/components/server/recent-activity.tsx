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
import { ReactNode } from 'react';
import ComponentHeading from '../material/component-heading';

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
  const response = await fetch('http://localhost:3001/api/recent-activity');
  const data = await response.json();

  var counter = 1;

  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow-md space-y-4">
      <ComponentHeading text="Recent Activity" />
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {data.map(
          (element: {
            group: string;
            type: string;
            description: string;
            time: string;
            service: string | null;
          }) => (
            <div
              key={counter++}
              className="flex items-center justify-between p-2 bg-white rounded-lg shadow"
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
            </div>
          ),
        )}
      </div>
      <button className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
        View Full Activity Log
      </button>
    </div>
  );
}
