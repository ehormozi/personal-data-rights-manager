'use client';

import { useState, useEffect } from 'react';

import { useSearchParams, useRouter } from 'next/navigation';

import { useLoading } from '@/context/loading-context';

import LoadingSpinner from '@/app/dashboard/components/material/loading-spinner';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const { isLoading, setIsLoading } = useLoading();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/auth/verify-reset-token?token=${token}`,
        );
        if (!response.ok) throw new Error('Invalid or expired token.');
        setValidToken(true);
      } catch (err: any) {
        setError(err.message);
      }
    };
    verifyToken();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!formData.newPassword || formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        'http://localhost:3001/api/auth/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword: formData.newPassword }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Password reset failed.');
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="flex flex-1 items-center justify-center bg-gray-100 py-8">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Reset Password
          </h2>
          {error && (
            <div className="text-red-500 text-sm text-center mt-4">{error}</div>
          )}
          {validToken ? (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/forgot-password')}
                className="text-blue-600 hover:underline"
              >
                Request a New Reset Link
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
