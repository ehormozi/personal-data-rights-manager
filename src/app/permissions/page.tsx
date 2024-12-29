import PermissionsDetailsServer from './components/server/permissions-details-server';
import PermissionsOverview from './components/server/permissions-overview';

interface Params {
  slug: string;
}

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default function Permissions({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <div className="flex flex-col bg-neutral-100 min-h-screen p-6 space-y-6">
      <header className="text-2xl font-semibold text-gray-950 border-b border-gray-300 pb-4">
        Permissions
      </header>
      <PermissionsOverview />
      {typeof searchParams.service === 'string' ? (
        <PermissionsDetailsServer prefilter={searchParams.service} />
      ) : (
        <PermissionsDetailsServer />
      )}
    </div>
  );
}
