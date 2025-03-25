import ProtectedPage from '@/components/client/protected-page';
import AccountInformationServer from './components/server/account-information-server';
import SecuritySettings from './components/client/security-settings';
import NotificationPreferencesServer from './components/server/notification-preferences-server';

export default function ProfileSecurity() {
  return (
    <ProtectedPage>
      <div className="flex flex-col bg-neutral-100 min-h-screen p-6 space-y-6">
        <header className="text-2xl font-semibold text-gray-950 border-b border-gray-300 pb-4">
          Profile & Security
        </header>
        <div className="flex flex-row bg-neutral-100 space-x-6">
          <div className="basis-1/2 space-y-4">
            <AccountInformationServer />
          </div>
          <div className="basis-1/2 space-y-4">
            <SecuritySettings />
            <NotificationPreferencesServer />
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
