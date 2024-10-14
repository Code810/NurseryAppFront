import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { api } from '@/utils/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const sendResetEmail = (email, token) => {
    const resetLink = `${window.location.origin}/resetpassword?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

    emailjs
      .send(
        'service_ghf678b',    
        'template_x5tg3mr',   
        {
          user_email: email,
          reset_link: resetLink,
        },
        '6I45DkBAhOJuG-kDd'   
      )
      .then((result) => {
        console.log('Email successfully sent!', result.text);
        setMessage('Password reset link has been sent to your email.');
        setErrorMessage('');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000); 
      })
      .catch((error) => {
        console.error('Failed to send the email...', error.text);
        setErrorMessage('Failed to send email. Please try again later.');
        setMessage('');
      });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await api().get(`/Auth/forget-password`, {
        params: {
          email,
        },
      });
      if (response.status === 200) {
        const { token } = response.data;
        sendResetEmail(email, token);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Email not found.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
        console.log(error);
      }
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-700">Şifrəni unutdum</h2>
          <p className="mt-2 text-sm text-gray-500">
           Şifrə yeniləmə linkini göndərmək üçün emailinizi daxil edin.
          </p>
        </div>
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Emailinizi daxil edin"
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-[#ed145b] rounded-lg shadow-md hover:bg-[#d90047] focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
            >
              Göndər
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Şifrəni xatırlayırsınızsa? <Link to="/login" className="font-medium text-pink-500">Daxil ol</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
