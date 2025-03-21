import ActivitySummary from './components/server/activity-summary';
import ActivityHistoryServer from './components/server/activity-history-server';
import ProtectedPage from '@/app/dashboard/components/material/protected-page';

export default function ActivityLog() {
  return (
    <ProtectedPage>
      <div className="flex flex-col bg-neutral-100 min-h-screen p-6 space-y-6">
        <header className="text-2xl font-semibold text-gray-950 border-b border-gray-300 pb-4">
          Activity Log
        </header>
        <ActivitySummary />
        <ActivityHistoryServer />
      </div>
    </ProtectedPage>
  );
}
