import { cookies } from 'next/headers';

import Widget from '@/app/dashboard/components/material/widget';

export default async function ActivitySummary() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const response = await fetch('http://localhost:3001/api/activity-summary', {
    method: 'GET',
    credentials: 'include',
    headers: { Cookie: `connect.sid=${sessionCookie}` },
  });
  const data = await response.json();

  const colorByCategory: Record<string, string> = {
    Logins: 'text-blue-700',
    'Permission Changes': 'text-yellow-700',
    'Data Requests': 'text-green-700',
    Alerts: 'text-red-700',
  };

  return (
    <Widget title="Activity Summary">
      <div className="flex justify-between items-center p-4">
        {Object.keys(colorByCategory).map((category, index) => (
          <div key={index} className="text-center">
            <p className={`text-lg font-semibold ${colorByCategory[category]}`}>
              {category}
            </p>
            <p className={`text-2xl font-bold ${colorByCategory[category]}`}>
              {data.find(
                (e: { category: string; count: number }) =>
                  e.category === category,
              )
                ? data.find(
                    (e: { category: string; count: number }) =>
                      e.category === category,
                  ).count
                : 0}
            </p>
          </div>
        ))}
      </div>
    </Widget>
  );
}
