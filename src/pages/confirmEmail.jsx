import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getConfirmEndpoint } from '@/api';

const ConfirmEmail = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const email = queryParams.get('email');

        if (token && email) {
            confirmEmail(email, token);
        } else {
            navigate('/notfound');
            setMessage('Invalid confirmation link.');
            setLoading(false);
        }
    }, [location.search]);

    const confirmEmail = async (email, token) => {
        try {
            const response = await axios.get(getConfirmEndpoint(), {
                params: {
                    email,
                    token
                }
            });
        
            if (response.status === 200 || response.status === 201) {
                setMessage('Your email has been confirmed successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setMessage('Email confirmation failed. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-700">Email təsdiqləmə</h2>
                    {loading ? (
                        <p className="mt-2 text-sm text-gray-500">Emailiniz təsdiqlənir... zəhmət olmasa gözləyin</p>
                    ) : (
                        <p className={`mt-2 text-sm ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmEmail;
