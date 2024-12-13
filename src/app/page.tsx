import PrivacyScore from '@/components/ui/privacy-score';
import PermissionsSummary from '../components/ui/permissions-summary';
import QuickActions from '../components/ui/quick-actions';
import RecentActivity from '../components/ui/recent-activity';
import YourDataAtAGlanceServer from '@/components/ui/your-data-at-a-glance-server';
import PermissionTrendsServer from '@/components/ui/permission-trends-server';

export default function Home() {
  return (
    <div className="flex flex-row">
      <div className="basis-2/5 border space-y-4 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Quick Overview
        </h3>
        <PermissionsSummary />
        <RecentActivity />
        <QuickActions />
      </div>
      <div className="basis-3/5 space-y-4 border p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Data Summary & Analytics
        </h3>
        <PrivacyScore />
        <YourDataAtAGlanceServer />
        <PermissionTrendsServer />
      </div>
    </div>
  );
}
