import RequestSummary from './components/server/request-summary';
import RequestHistoryServer from './components/server/request-history-server';

export default function Requests() {
  const handleCancelRequest = (id: number) => {
    console.log(`Cancel request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleResubmitRequest = (id: number) => {
    console.log(`Resubmit request with ID: ${id}`);
    // Add API call to resubmit the request
  };

  return (
    <div className="flex flex-col bg-neutral-100 min-h-screen p-6 space-y-6">
      <header className="text-2xl font-semibold text-gray-950 border-b border-gray-300 pb-4">
        Requests
      </header>
      <RequestSummary />
      <RequestHistoryServer />
    </div>
  );
}
