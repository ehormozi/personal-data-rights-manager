'use client';

import { useState } from 'react';

import { useLoading } from '@/context/loading-context';

import Widget from '@/components/server/widget';
import WhiteBox from '@/components/server/white-box';
import LoadingSpinner from '@/components/server/loading-spinner';

type AccountInformationClientProps = {
  firstName: string;
  lastName: string;
  email: string;
};

const AccountInformationClient: React.FC<AccountInformationClientProps> = ({
  firstName,
  lastName,
  email,
}) => {
  const [formData, setFormData] = useState({
    newFirstName: firstName,
    newLastName: lastName,
    newEmail: email,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isLoading, setIsLoading } = useLoading();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(
        'http://localhost:3001/api/auth/update-account-info',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: formData.newFirstName,
            lastName: formData.newLastName,
            email: formData.newEmail,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Update failed.');
      setSuccess(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Widget title="Account Information">
        <WhiteBox className="p-4 space-y-4">
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}
          {error && (
            <div className="text-red-500 text-sm text-center mt-4">{error}</div>
          )}
          <form onSubmit={handleUpdate} className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium">First Name:</span>
              <input
                type="text"
                name="newFirstName"
                defaultValue={firstName}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700 font-medium">Last Name:</span>
              <input
                type="text"
                name="newLastName"
                defaultValue={lastName}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700 font-medium">Email:</span>
              <input
                type="email"
                name="newEmail"
                defaultValue={email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
                required
              />
            </label>
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4">
              {loading ? 'Updating Profile...' : 'Update Profile'}
            </button>
          </form>
        </WhiteBox>
      </Widget>
    </>
  );
};

export default AccountInformationClient;
