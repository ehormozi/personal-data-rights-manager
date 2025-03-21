import { cookies } from 'next/headers';

import Widget from '@/components/server/widget';

export default async function RequestSummary() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const responseCountAll = await fetch(
    'http://localhost:3001/api/count-all-requests',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const dataCountAll = await responseCountAll.json();
  const countAll: number = dataCountAll[0].count;

  const responseCountByStatus = await fetch(
    'http://localhost:3001/api/count-requests-by-status',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const dataCountByStatus = await responseCountByStatus.json();

  return (
    <Widget title="Request Summary">
      <div className="flex justify-between items-center p-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Total Requests</p>
          <p className="text-2xl font-bold text-blue-600">{countAll}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">
            {dataCountByStatus.filter(
              (req: { status: string; count: number }) =>
                req.status === 'Pending',
            ).length === 0
              ? 0
              : dataCountByStatus.filter(
                  (req: { status: string; count: number }) =>
                    req.status === 'Pending',
                )[0].count}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {dataCountByStatus.filter(
              (req: { status: string; count: number }) =>
                req.status === 'Completed',
            ).length === 0
              ? 0
              : dataCountByStatus.filter(
                  (req: { status: string; count: number }) =>
                    req.status === 'Completed',
                )[0].count}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Failed</p>
          <p className="text-2xl font-bold text-red-600">
            {dataCountByStatus.filter(
              (req: { status: string; count: number }) =>
                req.status === 'Failed',
            ).length === 0
              ? 0
              : dataCountByStatus.filter(
                  (req: { status: string; count: number }) =>
                    req.status === 'Failed',
                )[0].count}
          </p>
        </div>
      </div>
    </Widget>
  );
}
