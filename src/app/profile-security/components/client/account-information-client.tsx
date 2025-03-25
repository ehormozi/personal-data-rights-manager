'use client';

import { useState } from 'react';

import { useLoading } from '@/context/loading-context';
import { useAuth } from '@/context/auth-context';

import { UserIcon } from '@heroicons/react/24/outline';

import Widget from '@/components/server/widget';
import WhiteBox from '@/components/server/white-box';
import LoadingSpinner from '@/components/server/loading-spinner';

type AccountInformationClientProps = {
  firstName: string;
  lastName: string;
  email: string;
  mfaEnabled: boolean;
};

const AccountInformationClient: React.FC<AccountInformationClientProps> = ({
  firstName,
  lastName,
  email,
  mfaEnabled,
}) => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(mfaEnabled);

  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    newFirstName: firstName,
    newLastName: lastName,
    newEmail: email,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files?.[0]) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const form = new FormData();
      form.append('firstName', formData.newFirstName);
      form.append('lastName', formData.newLastName);
      form.append('email', formData.newEmail);
      form.append('twoFactorEnabled', twoFactorEnabled.toString());
      if (file) {
        form.append('photo', file);
      }
      const response = await fetch(
        'http://localhost:3001/api/auth/update-account-info',
        {
          method: 'POST',
          credentials: 'include',
          body: form,
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Update failed.');
      }
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
            {
              /* eslint-disable @next/next/no-img-element */
              preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-1/3 aspect-square object-cover"
                />
              ) : user?.profile_photo_url ? (
                <img
                  src={'uploads/' + user?.profile_photo_url}
                  alt="Profile"
                  className="w-1/3 aspect-square object-cover"
                />
              ) : (
                <UserIcon aria-hidden="true" className="h-6 w-6" />
              )
            }
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>
            <label className="block">
              <span className="text-gray-700 font-medium">First Name:</span>
              <input
                type="text"
                name="newFirstName"
                defaultValue={firstName}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg"
                required
              />
            </label>
            <div className="flex justify-between items-center">
              <span>Two-Factor Authentication</span>
              <button
                name="twoFactorEnabled"
                className={`py-2 px-4 rounded-lg ${twoFactorEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              >
                {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
              </button>
            </div>
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
