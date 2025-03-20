import PrivacyScore from '@/components/server/privacy-score';
import PermissionsSummaryServer from '../components/server/permissions-summary-server';
import QuickActions from '../components/server/quick-actions';
import RecentActivity from '../components/server/recent-activity';
import YourDataAtAGlanceServer from '@/components/server/your-data-at-a-glance-server';
import PermissionTrendsServer from '@/components/server/permission-trends-server';
import ProtectedPage from '@/components/material/protected-page';

export default function Home() {
  return (
    <ProtectedPage>
      <div className="flex flex-col bg-neutral-100 min-h-screen p-6 space-y-6">
        <header className="text-2xl font-semibold text-gray-950 border-b border-gray-300 pb-4">
          Dashboard
        </header>
        <div className="flex flex-row bg-neutral-100 space-x-4">
          <div className="basis-2/5 space-y-4">
            <PermissionsSummaryServer />
            <RecentActivity />
            <QuickActions />
          </div>
          <div className="basis-3/5 space-y-4">
            <PrivacyScore />
            <YourDataAtAGlanceServer />
            <PermissionTrendsServer />
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
