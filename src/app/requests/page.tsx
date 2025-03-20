import ProtectedPage from '@/components/material/protected-page';
import RequestSummary from './components/server/request-summary';
import RequestHistoryServer from './components/server/request-history-server';

export default function Requests() {
  return (
    <ProtectedPage>
      <div className="flex flex-col bg-neutral-100 min-h-screen p-6 space-y-6">
        <header className="text-2xl font-semibold text-gray-950 border-b border-gray-300 pb-4">
          Requests
        </header>
        <RequestSummary />
        <RequestHistoryServer />
      </div>
    </ProtectedPage>
  );
}
