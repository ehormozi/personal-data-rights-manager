import ServicePermissionsTableClient from '../client/service-permissions-table-client';

export default async function ServicePermissionsTableServer(props: {
  name: string;
}) {
  const response = await fetch(
    `http://localhost:3001/api/service-permissions/${props.name}`,
  );
  const data = await response.json();

  let distinctAssets: string[] = [];

  const sensitivityLabels: Record<number, string> = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  };

  data.forEach(function (value: {
    id: number;
    asset: string;
    sensitivity: number;
    sensitivityLabel: string;
    time: string;
  }) {
    if (distinctAssets.includes(value.asset) === false) {
      distinctAssets.push(value.asset);
    }
    value.sensitivityLabel = sensitivityLabels[value.sensitivity];
    if (value.time) {
      const date = new Date(value.time);
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const minutes = date.getMinutes();
      const hours = date.getHours();
      const seconds = date.getSeconds();
      value.time =
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
    } else {
      value.time = 'Unknown';
    }
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
  return (
    <ServicePermissionsTableClient
      assets={distinctAssets}
      data={data}
      prefilter={props.name}
    />
  );
}
