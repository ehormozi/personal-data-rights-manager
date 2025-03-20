import { cookies } from 'next/headers';

import PermissionTrendsClient from '../client/permission-trends-client';

export default async function PermissionTrendsServer() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const responseGranted = await fetch(
    'http://localhost:3001/api/permissions-granted-weeks',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const responseRevoked = await fetch(
    'http://localhost:3001/api/permissions-revoked-weeks',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );

  if (responseGranted.status === 200 && responseRevoked.status === 200) {
    const date = new Date();
    const dayNum = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - dayNum + 3);
    const firstThursday = date.valueOf();
    date.setMonth(0, 1);
    if (date.getDay() !== 4) {
      date.setMonth(0, 1 + ((4 - date.getDay() + 7) % 7));
    }
    const weekNumber =
      1 + Math.ceil((firstThursday - date.valueOf()) / 604800000);
    const weeks = [weekNumber - 3, weekNumber - 2, weekNumber - 1, weekNumber];

    const dataGranted = await responseGranted.json();
    const dataRevoked = await responseRevoked.json();

    const keysGranted = dataGranted.map((e: any) => e.week);
    const keysRevoked = dataRevoked.map((e: any) => e.week);

    weeks.forEach((week) => {
      if (!keysGranted.includes(week)) {
        dataGranted.push({ week: week, count: 0 });
      }
    });
    weeks.forEach((week) => {
      if (!keysRevoked.includes(week)) {
        dataRevoked.push({ week: week, count: 0 });
      }
    });

    const dataGrantedSorted = dataGranted.sort(
      (
        n1: { week: number; count: string },
        n2: { week: number; count: string },
      ) => {
        if (n1.week > n2.week) {
          return 1;
        }
        if (n1.week < n2.week) {
          return -1;
        }
        return 0;
      },
    );
    const dataRevokedSorted = dataRevoked.sort(
      (
        n1: { week: number; count: string },
        n2: { week: number; count: string },
      ) => {
        if (n1.week > n2.week) {
          return 1;
        }
        if (n1.week < n2.week) {
          return -1;
        }
        return 0;
      },
    );

    const granted = dataGrantedSorted.map((e: { count: any }) => e.count);
    const revoked = dataRevokedSorted.map((e: { count: any }) => e.count);

    return <PermissionTrendsClient granted={granted} revoked={revoked} />;
  }
}
