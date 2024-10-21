import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/utils/axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [newRePassword, setNewRePassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const token = queryParams.get('token');

    if (!email || !token) {
      navigate('/notfound');
    }
  }, [location.search]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const token = queryParams.get('token');

    if (newPassword !== newRePassword) {
        setErrorMessage('Passwords do not match.');
        setMessage('');
        return;
    }

    try {
        const response = await api().post(`/Auth/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
            password: newPassword,
            rePassword: newRePassword
        });

        if (response.status === 200) {
            setMessage('Password has been reset successfully! Redirecting to login...');
            setErrorMessage('');

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setErrorMessage('Password reset failed. Please try again.');
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(error.response.data.message);
        } else {
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
        setMessage('');
    }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-700">Şifrə yeniləmə</h2>
          <p className="mt-2 text-sm text-gray-500">Yeni şifrənizi daxil edin.</p>
        </div>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Yeni şifrə
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="newRePassword" className="block text-sm font-medium text-gray-700">
              Təkrar yeni şifrə
            </label>
            <input
              id="newRePassword"
              name="newRePassword"
              type="password"
              required
              className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
              value={newRePassword}
              onChange={(e) => setNewRePassword(e.target.value)}
              placeholder="Re-enter new password"
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-[#ed145b] rounded-lg shadow-md hover:bg-[#d90047] focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
            >
              Yenilə
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
