import PermissionsTableServer from './components/server/permissions-table-server';

export default function PermissionsOverview() {
  return (
    <div className="flex flex-col bg-neutral-100 min-h-screen p-6 space-y-6">
      <header className="text-2xl font-semibold text-gray-950 border-b border-gray-300 pb-4">
        Permissions Overview
      </header>
      <PermissionsTableServer />
    </div>
  );
}
