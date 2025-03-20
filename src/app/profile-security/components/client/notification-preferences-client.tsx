'use client';

import { useState } from 'react';

import Widget from '@/components/material/widget';
import WhiteBox from '@/components/material/white-box';

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
      </WhiteBox>
    </Widget>
  );
}
