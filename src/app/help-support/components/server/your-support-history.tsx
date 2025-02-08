import WhiteBox from '@/components/material/white-box';
import Widget from '@/components/material/widget';

export default async function YourSupportHistory() {
  const supportHistory = [
    {
      id: 1,
      subject: 'Unable to revoke permissions',
      status: 'Resolved',
      date: '2024-01-10',
    },
    {
      id: 2,
      subject: 'How to set up two-factor authentication?',
      status: 'Pending',
      date: '2024-01-12',
    },
  ];

  return (
    <Widget title="Your Support History">
      <WhiteBox className="p-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left text-gray-800">
                Subject
              </th>
              <th className="border border-gray-300 p-2 text-left text-gray-800">
                Status
              </th>
              <th className="border border-gray-300 p-2 text-left text-gray-800">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {supportHistory.map((history) => (
              <tr key={history.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 text-gray-600">
                  {history.subject}
                </td>
                <td className="border border-gray-300 p-2 text-gray-600">
                  {history.status}
                </td>
                <td className="border border-gray-300 p-2 text-gray-600">
                  {history.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </WhiteBox>
    </Widget>
  );
}
