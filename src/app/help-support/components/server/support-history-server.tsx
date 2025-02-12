import SupportHistoryClient from '../client/support-history-client';

export default async function SupportHistoryServer() {
  const response = await fetch(
    'http://localhost:3001/api/user-support-requests',
  );
  const data = await response.json();

  let distinctStatuses: string[] = [];

  data.forEach(function (value: {
    id: number;
    subject: string;
    message: string;
    status: string;
    updated_at: string;
  }) {
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

  distinctStatuses.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });

  return <SupportHistoryClient statuses={distinctStatuses} data={data} />;
}
