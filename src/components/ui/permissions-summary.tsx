import {
  FaGoogle,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTiktok,
} from 'react-icons/fa';
import { Key, ReactNode } from 'react';

const icons: Record<string, ReactNode> = {
  Instagram: <FaInstagram size={16} />,
  Google: <FaGoogle size={16} />,
  Facebook: <FaFacebook size={16} />,
  Twitter: <FaTwitter size={16} />,
  LinkedIn: <FaLinkedin size={16} />,
  TikTok: <FaTiktok size={16} />,
};

export default async function PermissionsSummary() {
  const response = await fetch('http://localhost:3001/api/authorizations');
  const data = await response.json();

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Permissions Summary
      </h2>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {data.map((row: { service: string; assets: number }, index: Key) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 bg-white rounded-lg shadow"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <span className="p-2 bg-blue-100 text-blue-800 rounded-full">
                {icons[row.service]}
              </span>
              <div>
                <p className="text-gray-700 font-medium">{row.service}</p>
                <p className="text-gray-500 text-sm">
                  {row.assets +
                    ' ' +
                    (row.assets == 1 ? 'Permission' : 'Permissions')}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="py-2 px-4 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 whitespace-nowrap">
                Manage
              </button>
              <button className="py-2 px-4 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 whitespace-nowrap">
                Revoke All
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
        View All Permissions
      </button>
    </div>
  );
}
