import { cookies } from 'next/headers';

import SecuritySettingsClient from '../client/security-settings-client';

export default async function SecuritySettingsServer() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;
  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }
  const response = await fetch('http://localhost:3001/api/user-mfa-enabled', {
    method: 'GET',
    credentials: 'include',
    headers: { Cookie: `connect.sid=${sessionCookie}` },
  });
  const data = await response.json();
  const mfaEnabled: boolean = data[0].mfa_enabled;
  return <SecuritySettingsClient twoFactorEnabled={mfaEnabled} />;
}
