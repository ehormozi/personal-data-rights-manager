'use client';

import { useState } from 'react';
import Widget from '@/components/material/widget';
import WhiteBox from '@/components/material/white-box';

export default function ProfileSecurity() {
  // Mock user data
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    linkedAccounts: ['Google', 'Facebook'],
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [notificationPreferences, setNotificationPreferences] = useState<
    Record<string, boolean>
  >({
    securityAlerts: true,
    accountUpdates: true,
    marketingEmails: false,
    activitySummaries: true,
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({ ...prevPasswords, [name]: value }));
  };

  const toggleNotification = (category: string) => {
    setNotificationPreferences((prev: Record<string, boolean>) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleUpdate = () => {
    console.log('Updated User Data:', userData);
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* Account Information */}
      <Widget title="Account Information">
        <WhiteBox className="p-4 space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">First Name:</span>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">Last Name:</span>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">Email:</span>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </label>
          <p>
            <strong>Linked Accounts:</strong>{' '}
            {userData.linkedAccounts.join(', ')}
          </p>
          <button
            onClick={handleUpdate}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
          >
            Update Profile
          </button>
        </WhiteBox>
      </Widget>

      {/* Security Settings */}
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
          <div className="flex justify-between items-center">
            <span>Two-Factor Authentication</span>
            <button
              className={`py-2 px-4 rounded-lg ${twoFactorEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
            </button>
          </div>
        </WhiteBox>
      </Widget>

      {/* Notification Preferences */}
      <Widget title="Notification Preferences">
        <WhiteBox className="p-4 space-y-4">
          {Object.entries(notificationPreferences).map(
            ([category, enabled]) => (
              <div
                key={category}
                className="flex justify-between items-center py-2"
              >
                <span className="text-gray-700">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <button
                  className={`py-1 px-3 rounded-lg text-white ${enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  onClick={() => toggleNotification(category)}
                >
                  {enabled ? 'On' : 'Off'}
                </button>
              </div>
            ),
          )}
        </WhiteBox>
      </Widget>
    </div>
  );
}
