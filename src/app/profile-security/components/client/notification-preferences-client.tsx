'use client';

import { useState } from 'react';

import Widget from '@/app/dashboard/components/material/widget';
import WhiteBox from '@/app/dashboard/components/material/white-box';

export default function NotificationPreferencesClient(props: {
  notificationPreferences: Record<string, boolean>;
}) {
  const [notificationPreferences, setNotificationPreferences] = useState<
    Record<string, boolean>
  >(props.notificationPreferences);

  const toggleNotification = (category: string) => {
    setNotificationPreferences((prev: Record<string, boolean>) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleUpdate = () => {
    console.log('Updated Notification Preferences');
  };

  return (
    <Widget title="Notification Preferences">
      <WhiteBox className="p-4 space-y-4">
        {Object.entries(notificationPreferences).map(([category, enabled]) => (
          <div
            key={category}
            className="flex justify-between items-center py-2"
          >
            <span className="text-gray-700">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <button
              className={`py-1 px-3 rounded-lg text-white ${enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              onClick={() => toggleNotification(category)}
            >
              {enabled ? 'On' : 'Off'}
            </button>
          </div>
        ))}
        <button
          onClick={handleUpdate}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
        >
          Update Notification Preferences
        </button>
      </WhiteBox>
    </Widget>
  );
}
