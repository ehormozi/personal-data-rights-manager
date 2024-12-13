import React from 'react';
import { Chart, ArcElement } from 'chart.js';
import YourDataAtAGlanceClient from './your-data-at-a-glance-client';

Chart.register(ArcElement);

export default async function YourDataAtAGlanceServer() {
  const response = await fetch(
    'http://localhost:3001/api/count-by-asset-catgory',
  );
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
