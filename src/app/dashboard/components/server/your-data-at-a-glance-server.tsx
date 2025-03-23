import React from 'react';
import { Chart, ArcElement } from 'chart.js';
import { cookies } from 'next/headers';

import YourDataAtAGlanceClient from '../client/your-data-at-a-glance-client';

Chart.register(ArcElement);

const YourDataAtAGlanceServer: React.FC = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const response = await fetch(
    'http://localhost:3001/api/count-by-asset-catgory',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  if (response.status === 200) {
    const data = await response.json();
    const dataSorted = data.sort(
      (
        n1: { category: string; count: number },
        n2: { category: string; count: number },
      ) => {
        if (n1.count < n2.count) {
          return 1;
        }
        if (n1.count > n2.count) {
          return -1;
        }
        return 0;
      },
    );
    const labels = dataSorted.map(
      (e: { count: any; category: string }) => e.category,
    );
    const dataValues = dataSorted.map((e: { count: any; category: string }) =>
      Number(e.count),
    );
    return <YourDataAtAGlanceClient labels={labels} values={dataValues} />;
  }
};

export default YourDataAtAGlanceServer;
