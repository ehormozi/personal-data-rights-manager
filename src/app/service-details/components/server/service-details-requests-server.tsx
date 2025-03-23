import { cookies } from 'next/headers';

import ServiceDetailsRequestsClient from '../client/service-details-requests-client';

type ServiceDetailsRequestsServerProps = {
  name: string;
};

const ServiceDetailsRequestsServer: React.FC<
  ServiceDetailsRequestsServerProps
> = async ({ name }) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const responseStatus = await fetch(
    `http://localhost:3001/api/count-service-requests-by-status/${name}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const dataStatus = await responseStatus.json();

  const responseWeek = await fetch(
    `http://localhost:3001/api/count-service-requests-by-week/${name}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const dataWeek = await responseWeek.json();

  const response = await fetch(
    `http://localhost:3001/api/service-requests/${name}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const data = await response.json();

  const newDataStatus = dataStatus.map(
    (e: { status: string; count: string }) => ({
      status: e.status,
      count: parseInt(e.count),
    }),
  );

  let distinctTypes: string[] = [];
  let distinctServices: string[] = [];
  let distinctAssets: string[] = [];
  let distinctStatuses: string[] = [];

  data.forEach(function (value: {
    id: number;
    type: string;
    service: string;
    asset: string;
    status: string;
    updated_at: string;
  }) {
    if (distinctTypes.includes(value.type) === false) {
      distinctTypes.push(value.type);
    }
    if (distinctServices.includes(value.service) === false) {
      distinctServices.push(value.service);
    }
    if (distinctAssets.includes(value.asset) === false) {
      distinctAssets.push(value.asset);
    }
    if (distinctStatuses.includes(value.status) === false) {
      distinctStatuses.push(value.status);
    }
    const date = new Date(value.updated_at);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const seconds = date.getSeconds();
    value.updated_at =
      year +
      '-' +
      (monthIndex + 1 < 10 ? '0' + (monthIndex + 1) : monthIndex + 1) +
      '-' +
      (day < 10 ? '0' + day : day) +
      ' ' +
      (hours < 10 ? '0' + hours : hours) +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds);
  });

  distinctTypes.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
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

  distinctStatuses.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });

  return (
    <ServiceDetailsRequestsClient
      countByStatus={newDataStatus}
      countByWeek={dataWeek}
      types={distinctTypes}
      services={distinctServices}
      assets={distinctAssets}
      statuses={distinctStatuses}
      data={data}
    />
  );
};

export default ServiceDetailsRequestsServer;
