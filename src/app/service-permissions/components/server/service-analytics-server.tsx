import ServiceAnalyticsClient from '../client/service-analytics-client';

export default async function ServiceAnalyticsServer(props: { name: string }) {
  const responseSensitivity = await fetch(
    `http://localhost:3001/api/count-service-permissions-by-sensitivity/${props.name}`,
  );
  const dataSensitivity = await responseSensitivity.json();

  const responseWeek = await fetch(
    `http://localhost:3001/api/count-service-permissions-by-week/${props.name}`,
  );
  const dataWeek = await responseWeek.json();

  return (
    <ServiceAnalyticsClient
      countBySensitivity={dataSensitivity}
      countByWeek={dataWeek}
    />
  );
}
