import { cookies } from 'next/headers';

import FAQClient from '../client/faq-client';

const FAQServer: React.FC = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const response = await fetch('http://localhost:3001/api/faqs', {
    method: 'GET',
    credentials: 'include',
    headers: { Cookie: `connect.sid=${sessionCookie}` },
  });
  const data = await response.json();

  return <FAQClient data={data} />;
};

export default FAQServer;
