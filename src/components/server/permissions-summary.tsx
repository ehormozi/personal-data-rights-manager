import {
  FaGoogle,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTiktok,
} from 'react-icons/fa';
import { Key, ReactNode } from 'react';
import Widget from '../material/widget';
import WhiteBox from '../material/white-box';
import Button from '../material/button';

const icons: Record<string, ReactNode> = {
  Instagram: <FaInstagram size={16} />,
  Google: <FaGoogle size={16} />,
  Facebook: <FaFacebook size={16} />,
  Twitter: <FaTwitter size={16} />,
  LinkedIn: <FaLinkedin size={16} />,
  TikTok: <FaTiktok size={16} />,
};

export default async function PermissionsSummary() {
  const response = await fetch(
    'http://localhost:3001/api/count-authorizations-by-service',
  );
  const data = await response.json();

  return (
    <Widget title="Permissions Summary">
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {data.map((row: { service: string; assets: number }, index: Key) => (
          <WhiteBox
            key={index}
            className="flex p-3 justify-between items-center"
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
              <Button
                text="Manage"
                color="bg-blue-600"
                hover="hover:bg-blue-700"
              />
              <Button
                text="Revoke All"
                color="bg-red-600"
                hover="hover:bg-red-700"
              />
            </div>
          </WhiteBox>
        ))}
      </div>
      <Button
        text="View All Permissions"
        color="bg-blue-600"
        hover="hover:bg-blue-700"
        className="w-full mt-4"
      />
    </Widget>
  );
}
