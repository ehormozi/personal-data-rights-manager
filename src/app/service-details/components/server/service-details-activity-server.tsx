import ServiceDetailsActivityClient from '../client/service-details-activity-client';

export default async function ServiceDetailsActivityServer(props: {
  name: string;
}) {
  const responseCategory = await fetch(
    `http://localhost:3001/api/count-service-activities-by-category/${props.name}`,
  );
  const dataCategory = await responseCategory.json();

  const responseWeek = await fetch(
    `http://localhost:3001/api/count-service-activities-by-week/${props.name}`,
  );
  const dataWeek = await responseWeek.json();

  const response = await fetch(
    `http://localhost:3001/api/service-activity/${props.name}`,
  );
  const data = await response.json();

  const newDataCategory = dataCategory.map(
    (e: { category: string; count: string }) => ({
      category: e.category,
      count: parseInt(e.count),
    }),
  );

  let newData: {
    id: number;
    time: string;
    category: string;
    event: string;
    details: string;
    action: string;
  }[] = [];

  data.forEach(
    (row: {
      id: number;
      time: string;
      category: string;
      event: string;
      details: string;
      service: string;
      action: string;
    }) => {
      if (newData.filter((r) => r.id === row.id).length === 0) {
        row.details = row.details.replaceAll('[Service Name]', row.service);
        newData.push(row);
      } else {
        let newRow = newData.find((r) => r.id === row.id);
        if (newRow) {
          newRow.action = newRow.action + ', ' + row.action;
        }
      }
    },
  );

  let distinctCategories: string[] = [];
  let distinctEvents: string[] = [];

  newData.forEach(function (value: {
    id: number;
    time: string;
    category: string;
    event: string;
    details: string;
    action: string;
  }) {
    if (!distinctCategories.includes(value.category)) {
      distinctCategories.push(value.category);
    }
    if (!distinctEvents.includes(value.event)) {
      distinctEvents.push(value.event);
    }
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
  });

  distinctCategories.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });

  distinctEvents.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });

  return (
    <ServiceDetailsActivityClient
      countByCategory={newDataCategory}
      countByWeek={dataWeek}
      categories={distinctCategories}
      events={distinctEvents}
      data={newData}
      prefilter={props.name}
    />
  );
}
