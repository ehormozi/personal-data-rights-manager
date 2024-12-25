import PrivacyScore from '@/components/server/privacy-score';
import PermissionsSummaryServer from '../components/server/permissions-summary-server';
import QuickActions from '../components/server/quick-actions';
import RecentActivity from '../components/server/recent-activity';
import YourDataAtAGlanceServer from '@/components/server/your-data-at-a-glance-server';
import PermissionTrendsServer from '@/components/server/permission-trends-server';

export default function Home() {
  return (
    <div className="flex flex-row bg-neutral-100">
      <div className="basis-2/5 space-y-4 p-6">
        <h3 className="text-2xl leading-none tracking-tight text-gray-950">
          Quick Overview
        </h3>
        <PermissionsSummaryServer />
        <RecentActivity />
        <QuickActions />
      </div>
      <div className="basis-3/5 space-y-4 py-6 pr-6">
        <h3 className="text-2xl leading-none tracking-tight text-gray-950">
          Data Summary & Analytics
        </h3>
        <PrivacyScore />
        <YourDataAtAGlanceServer />
        <PermissionTrendsServer />
      </div>
    </div>
  );
}
