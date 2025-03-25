'use client';

import { useState } from 'react';

import Widget from '@/components/server/widget';
import WhiteBox from '@/components/server/white-box';

const SecuritySettings: React.FC = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handlePasswordChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({ ...prevPasswords, [name]: value }));
  };

  return (
    <Widget title="Security Settings">
      <WhiteBox className="p-4 space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Current Password:</span>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">New Password:</span>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">
            Confirm New Password:
          </span>
          <input
            type="password"
            name="confirmNewPassword"
            value={passwords.confirmNewPassword}
            onChange={handlePasswordChange}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </label>
        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Change Password
        </button>
      </WhiteBox>
    </Widget>
  );
};

export default SecuritySettings;
