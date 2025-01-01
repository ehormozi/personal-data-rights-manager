import RequestHistoryClient from '../client/request-history-client';

export default async function RequestHistoryServer() {
  const response = await fetch('http://localhost:3001/api/user-requests');
  const data = await response.json();

  let newData: {
    id: number;
    type: string;
    service: string;
    asset: string;
    status: string;
    updated_at: string;
    action: string;
  }[] = [];

  data.forEach(
    (row: {
      id: number;
      type: string;
      service: string;
      asset: string;
      status: string;
      updated_at: string;
      action: string;
    }) => {
      if (newData.filter((r) => r.id === row.id).length === 0) {
        newData.push(row);
      } else {
        let newRow = newData.filter((r) => r.id === row.id)[0];
        newRow.action = newRow.action + ', ' + row.action;
      }
    },
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
      day +
      '/' +
      (monthIndex + 1) +
      '/' +
      year +
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
    <RequestHistoryClient
      types={distinctTypes}
      services={distinctServices}
      assets={distinctAssets}
      statuses={distinctStatuses}
      data={newData}
    />
  );
}
