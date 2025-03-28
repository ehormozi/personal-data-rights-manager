import { cookies } from 'next/headers';

import Widget from '@/components/server/widget';

const PermissionsOverview: React.FC = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const responseTotalPermissions = await fetch(
    'http://localhost:3001/api/count-all-authorizations',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const dataTotalPermissions = await responseTotalPermissions.json();
  const totalPermissions: number = dataTotalPermissions[0].count;

  const responseSensitivePermissions = await fetch(
    'http://localhost:3001/api/count-sensitive-authorizations',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const dataSensitivePermissions = await responseSensitivePermissions.json();
  const sensitivePermissions: number = dataSensitivePermissions[0].count;

  const responseTopService = await fetch(
    'http://localhost:3001/api/top-service',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const dataTopService = await responseTopService.json();
  const topService: string = dataTopService[0].service;
  const topServicePermissions: number = dataTopService[0].count;

  return (
    <Widget title="Permissions Overview">
      <div className="flex justify-between items-center p-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Total Permissions
          </p>
          <p className="text-2xl font-bold text-blue-600">{totalPermissions}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Sensitive Permissions
          </p>
          <p className="text-2xl font-bold text-red-600">
            {sensitivePermissions}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Top Service</p>
          <p className="text-sm text-gray-500">{topService}</p>
          <p className="text-2xl font-bold text-green-600">
            {topServicePermissions}
          </p>
        </div>
      </div>
    </Widget>
  );
};

export default PermissionsOverview;
