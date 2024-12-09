import PrivacyScore from '@/components/ui/privacy-score';
import PermissionsSummary from '../components/ui/permissions-summary';
import QuickActions from '../components/ui/quick-actions';
import RecentActivity from '../components/ui/recent-activity';

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
        <div className="border">
          <h4 className="text-xl font-semibold leading-none tracking-tight">
            Your Data at a Glance
          </h4>
        </div>
        <div className="border">
          <h4 className="text-xl font-semibold leading-none tracking-tight">
            Important Alerts
          </h4>
        </div>
      </div>
    </div>
  );
}
