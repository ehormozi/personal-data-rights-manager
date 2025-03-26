import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

import ProtectedPage from '@/components/client/protected-page';
import ServiceHeader from './components/server/service-header';
import ServiceDetailsPermissionsServer from './components/server/service-details-permissions-server';
import ServiceDetailsRequestsServer from './components/server/service-details-requests-server';
import ServiceDetailsActivityServer from './components/server/service-details-activity-server';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const mockServiceData = {
  permissions: [
    { asset: 'Email Address', sensitivity: 'High', grantedDate: '2024-01-10' },
    { asset: 'Contacts', sensitivity: 'Medium', grantedDate: '2024-01-08' },
    { asset: 'Location', sensitivity: 'High', grantedDate: '2024-01-05' },
  ],
};

export default async function ServicePermissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const service = (await searchParams).service;
  if (typeof service === 'string') {
    return (
      <ProtectedPage>
        <div className="p-6 space-y-6 bg-neutral-100">
          <ServiceHeader
            logo={`https://img.logo.dev/${service}.com?token=pk_R_PqZb2eSUafz-H25PKuwQ`}
            name={service}
          />
          <ServiceDetailsPermissionsServer name={service} />
          <ServiceDetailsRequestsServer name={service} />
          <ServiceDetailsActivityServer name={service} />
        </div>
      </ProtectedPage>
    );
  }
}
