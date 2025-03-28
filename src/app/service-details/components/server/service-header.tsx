import { cookies } from 'next/headers';

import Widget from '@/components/server/widget';

type ServiceHeaderProps = {
  logo: string;
  name: string;
};

const ServiceHeader: React.FC<ServiceHeaderProps> = async ({ logo, name }) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const response = await fetch(
    `http://localhost:3001/api/service-last-activity/${name}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );

  const data = await response.json();

  data.forEach(function (value: { last_activity: string | number | Date }) {
    if (value.last_activity) {
      const date = new Date(value.last_activity);
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const minutes = date.getMinutes();
      const hours = date.getHours();
      const seconds = date.getSeconds();
      value.last_activity =
        (day < 10 ? '0' + day : day) +
        '/' +
        (monthIndex + 1 < 10 ? '0' + (monthIndex + 1) : monthIndex + 1) +
        '/' +
        year +
        ' ' +
        (hours < 10 ? '0' + hours : hours) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes) +
        ':' +
        (seconds < 10 ? '0' + seconds : seconds);
    } else {
      value.last_activity = 'No activity recorded';
    }
  });

  const lastActivity = data[0]['last_activity']
    ? data[0]['last_activity']
    : 'No activity recorded';

  return (
    <Widget showHeader={false} title="Service Header">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={`${name} Logo`} className="h-16 w-16" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
            <p className="text-gray-600">Last Activity: {lastActivity}</p>
          </div>
        </div>
      </nav>
    </Widget>
  );
};

export default ServiceHeader;
