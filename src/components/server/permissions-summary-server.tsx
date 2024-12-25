import PermissionsSummaryClient from '../client/permissions-summary client';

export default async function PermissionsSummaryServer() {
  const response = await fetch(
    'http://localhost:3001/api/count-authorizations-by-service',
  );
  const data = await response.json();

  return <PermissionsSummaryClient data={data} />;
}
