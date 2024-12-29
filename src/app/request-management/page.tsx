import RequestSummary from './components/server/request-summary';
import RequestHistoryServer from './components/server/request-history-server';

export default function RequestManagement() {
  const handleCancelRequest = (id: number) => {
    console.log(`Cancel request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleResubmitRequest = (id: number) => {
    console.log(`Resubmit request with ID: ${id}`);
    // Add API call to resubmit the request
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Request Management</h1>
      <RequestSummary />
      <RequestHistoryServer />
    </div>
  );
}
