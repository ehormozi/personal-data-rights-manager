import { cookies } from 'next/headers';

import PermissionsDetailsClient from '../client/permissions-details-client';

type PermissionsDetailsServerProps = {
  prefilter?: string;
};

const PermissionsDetailsServer: React.FC<
  PermissionsDetailsServerProps
> = async ({ prefilter }) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const response = await fetch(
    'http://localhost:3001/api/all-user-authorizations',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const data = await response.json();

  let distinctServices: string[] = [];
  let distinctAssets: string[] = [];

  const sensitivityLabels: Record<number, string> = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  };

  data.forEach(function (value: {
    id: number;
    service: string;
    asset: string;
    sensitivity: number;
    sensitivityLabel: string;
  }) {
    if (distinctServices.includes(value.service) === false) {
      distinctServices.push(value.service);
    }
    if (distinctAssets.includes(value.asset) === false) {
      distinctAssets.push(value.asset);
    }
    value.sensitivityLabel = sensitivityLabels[value.sensitivity];
  });

  distinctServices.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });

  distinctAssets.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
  return typeof prefilter === 'string' ? (
    <PermissionsDetailsClient
      services={distinctServices}
      assets={distinctAssets}
      data={data}
      prefilter={prefilter}
    />
  ) : (
    <PermissionsDetailsClient
      services={distinctServices}
      assets={distinctAssets}
      data={data}
    />
  );
};

export default PermissionsDetailsServer;
