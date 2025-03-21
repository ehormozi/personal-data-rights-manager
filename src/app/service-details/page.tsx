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

interface Params {
  slug: string;
}

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default function ServicePermissionsPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  if (typeof searchParams.service === 'string') {
    return (
      <ProtectedPage>
        <div className="p-6 space-y-6 bg-neutral-100">
          <ServiceHeader
            logo={`https://img.logo.dev/${searchParams.service}.com?token=pk_R_PqZb2eSUafz-H25PKuwQ`}
            name={searchParams.service}
          />
          <ServiceDetailsPermissionsServer name={searchParams.service} />
          <ServiceDetailsRequestsServer name={searchParams.service} />
          <ServiceDetailsActivityServer name={searchParams.service} />
        </div>
      </ProtectedPage>
    );
  }
}
