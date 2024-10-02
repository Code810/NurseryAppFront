import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginEndpoint } from '@/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(getLoginEndpoint(), {
        userNameOrEmail: username, 
        password: password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        console.log('Login successful, token set in localStorage');
        setErrorMessage(''); 
        navigate('/'); 
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid username or password.');
      } else {
        setErrorMessage('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-200 via-yellow-200 to-green-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-700">Göyqurşağı bağçası</h2>
          <p className="mt-2 text-sm text-gray-500">
            Zəhmət olmasa giriş məlumatlarınızı daxil edin...
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              İstifadəçi adı və ya Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username or email"
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Şifrə
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-[#ed145b] rounded-lg shadow-md hover:bg-[#d90047] focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
            >
              Daxil ol
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link to={"/forgotpassword"}  className="text-sm text-blue-600">Şifrəni unutmusan?</Link>
          <p className="text-sm text-gray-600">
            profiliniz  yoxdur? <Link to={"/register"} className="font-medium text-pink-500">Qeydiyyat</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
