import ProtectedPage from '@/components/material/protected-page';
import AccountInformationServer from './components/server/account-information-server';
import SecuritySettingsServer from './components/server/security-settings-server';
import NotificationPreferencesServer from './components/server/notification-preferences-server';

export default function ProfileSecurity() {
  return (
    <ProtectedPage>
      <div className="p-6 grid grid-cols-2 gap-6">
        <AccountInformationServer />
        <SecuritySettingsServer />
        <NotificationPreferencesServer />
      </div>
    </ProtectedPage>
  );
}
