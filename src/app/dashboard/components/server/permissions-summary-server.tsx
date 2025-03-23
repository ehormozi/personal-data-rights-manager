import { cookies } from 'next/headers';

import PermissionsSummaryClient from '../client/permissions-summary client';

const PermissionsSummaryServer: React.FC = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const response = await fetch(
    'http://localhost:3001/api/count-authorizations-by-service',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );

  if (response.ok) {
    const data = await response.json();
    return <PermissionsSummaryClient data={data} />;
  }
};

export default PermissionsSummaryServer;
