import { cookies } from 'next/headers';

import AccountInformationClient from '../client/account-information-client';

const AccountInformationServer: React.FC = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;
  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }
  const response = await fetch('http://localhost:3001/api/auth/account-info', {
    method: 'GET',
    credentials: 'include',
    headers: { Cookie: `connect.sid=${sessionCookie}` },
  });
  const data = await response.json();

  return (
    <AccountInformationClient
      firstName={data.first_name}
      lastName={data.last_name}
      email={data.email}
      mfaEnabled={data.mfa_enabled}
    />
  );
};

export default AccountInformationServer;
