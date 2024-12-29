//'use client';

//import { useState } from 'react';
import Widget from '@/components/material/widget';
import RequestSummary from './components/server/request-summary';

export default function RequestManagement() {
  /*
  const [requests, setRequests] = useState([
    {
      id: 1,
      type: 'Data Deletion',
      service: 'Google',
      asset: 'Email',
      status: 'Pending',
      date: '2024-01-01 12:00 PM',
    },
    {
      id: 2,
      type: 'Data Export',
      service: 'Facebook',
      asset: 'Photos',
      status: 'Completed',
      date: '2024-01-02 03:00 PM',
    },
    {
      id: 3,
      type: 'Data Deletion',
      service: 'Instagram',
      asset: 'Followers',
      status: 'Failed',
      date: '2024-01-03 08:00 AM',
    },
  ]);
  */

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
      <Widget title="Request History">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 p-2 text-left text-gray-800">
                  Type
                </th>
                <th className="border border-gray-200 p-2 text-left text-gray-800">
                  Service
                </th>
                <th className="border border-gray-200 p-2 text-left text-gray-800">
                  Asset
                </th>
                <th className="border border-gray-200 p-2 text-left text-gray-800">
                  Status
                </th>
                <th className="border border-gray-200 p-2 text-left text-gray-800">
                  Date
                </th>
                <th className="border border-gray-200 p-2 text-center text-gray-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </Widget>
    </div>
  );
}
