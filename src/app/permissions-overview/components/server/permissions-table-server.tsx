import PermissionsTableClient from '../client/permissions-table-client';

export default async function PermissionsTableServer() {
  const response = await fetch(
    'http://localhost:3001/api/all-user-authorizations',
  );
  const data = await response.json();

  let distinctServices: string[] = [];
  let distinctAssets: string[] = [];
  let dataProcessed: {
    service: string;
    permissions: string;
    sensitivity: number;
  }[] = [];

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
    if (
      dataProcessed.filter((line) => line.service === value.service).length ===
      0
    ) {
      dataProcessed.push({
        service: value.service,
        permissions: '',
        sensitivity: 0,
      });
    }
    let line = dataProcessed.filter(
      (line) => line.service === value.service,
    )[0];
    if (line.permissions.length === 0) {
      line.permissions += value.asset;
      line.sensitivity = value.sensitivity;
    } else {
      line.permissions += ', ' + value.asset;
    }
  });

  return (
    <PermissionsTableClient
      services={distinctServices}
      assets={distinctAssets}
      data={dataProcessed}
    />
  );
}
