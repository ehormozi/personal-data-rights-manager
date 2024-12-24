import PermissionsTableServer from './components/server/permissions-table-server';

export default function PermissionsOverview() {
  return (
    <div className="flex flex-col bg-neutral-100 min-h-screen p-6 space-y-6">
      <header className="text-2xl font-semibold text-gray-950 border-b border-gray-300 pb-4">
        Permissions Overview
      </header>

      <PermissionsTableServer />

      <section className="flex flex-col bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Bulk Actions</h2>
        <div className="h-32 flex items-center justify-center text-gray-400">
          Placeholder for Bulk Actions
        </div>
      </section>
    </div>
  );
}
