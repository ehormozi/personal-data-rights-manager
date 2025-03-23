import { cookies } from 'next/headers';

import NotificationPreferencesClient from '../client/notification-preferences-client';

const NotificationPreferencesServer: React.FC = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;
  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }
  const response = await fetch(
    'http://localhost:3001/api/user-notification-preferences',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const data = await response.json();
  const dataTransformed = data.reduce(
    (acc: { [x: string]: any }, { category, enabled }: any) => {
      acc[category] = enabled;
      return acc;
    },
    {} as Record<string, boolean>,
  );
  return <NotificationPreferencesClient newPreferences={dataTransformed} />;
};

export default NotificationPreferencesServer;
