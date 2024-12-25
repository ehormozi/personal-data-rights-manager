import PermissionsTableClient from '../client/permissions-table-client';

export default async function PermissionsTableServer(props: {
  prefilter?: string;
}) {
  const response = await fetch(
    'http://localhost:3001/api/all-user-authorizations',
  );
  const data = await response.json();

  let distinctServices: string[] = [];
  let distinctAssets: string[] = [];

  data.forEach(function (value: {
    service: string;
    asset: string;
    sensitivity: number;
  }) {
    if (distinctServices.includes(value.service) === false) {
      distinctServices.push(value.service);
    }
    if (distinctAssets.includes(value.asset) === false) {
      distinctAssets.push(value.asset);
    }
  });

  return typeof props.prefilter === 'string' ? (
    <PermissionsTableClient
      services={distinctServices}
      assets={distinctAssets}
      data={data}
      prefilter={props.prefilter}
    />
  ) : (
    <PermissionsTableClient
      services={distinctServices}
      assets={distinctAssets}
      data={data}
    />
  );
}
