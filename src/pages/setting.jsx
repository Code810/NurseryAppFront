import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "./setting.css"
import { Button } from '@/components/ui/button';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UpdateUser from '@/components/sections/Profile/updateuser';
import { api } from '@/utils/axios';

const Setting = () => {
    const { userData, userRole, authToken } = useOutletContext(); 
    const [appUserData, setAppUserData] = useState(null);
    const [updatedUserData, setUpdatedUserData] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState('');
    const [showPassword, setShowPassword] = useState({
        password: false,
        newPassword: false,
        newRePassword: false,
    });
    useEffect(() => {
        if (authToken) {
            try {
                const decodedToken = jwtDecode(authToken);
                const userId = decodedToken?.nameid;

                if (userId) {
                    const fetchUserData = async () => {
                        try {
                            const response = await api().get(`/AppUser/${userId}`);
                            setAppUserData(response.data);
                            setUpdatedUserData(response.data);
                            setLoading(false);
                        } catch (errors) {
                            setGeneralError('Failed to fetch user data.');
                            setLoading(false);
                        }
                    };

                    fetchUserData();
                } else {
                    setGeneralError('Invalid user ID in token.');
                    setLoading(false);
                }
            } catch (error) {
                setGeneralError('Failed to decode token.');
                setLoading(false);
            }
        }
    }, [authToken]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFieldErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleUpdateUser = async () => {
        try {
            await api().put(`/AppUser/update/${updatedUserData.id}`, updatedUserData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            showToast('User məlumatlarınız uğurla dəyişdirildi', 'success');

            setUpdatedUserData((prev) => ({
                ...prev,
                password: '',
                newPassword: '',
                newRePassword: '',
            }));

            setFieldErrors({});
            setGeneralError('');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message;

                if (errorMessage.includes('username')) {
                    setFieldErrors((prev) => ({
                        ...prev,
                        userName: errorMessage,
                    }));
                } else if (errorMessage.includes('Şifrə')) {
                    setFieldErrors((prev) => ({
                        ...prev,
                        password: errorMessage,
                    }));
                } else if (errorMessage.includes('email')) {
                    setFieldErrors((prev) => ({
                        ...prev,
                        email: errorMessage,
                    }));
                } else {
                    setGeneralError(errorMessage);
                }
            } else {
                setGeneralError('Failed to update user data.');
            }
        }
    };

    const showToast = (message, type) => {
        setToastMessage(message);
        const toast = document.getElementById('toast');
        toast.className = `toast show ${type}`;
        setTimeout(() => {
            toast.className = toast.className.replace('show', '');
            setToastMessage('');
        }, 3000);
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    return (
        <main className="md:ml-64 p-6 py-1 flex-1">
            <section className="mt-6 bg-white p-6 rounded-xl shadow-md">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Update User Data</h2>
                        <div className="flex gap flex-wrap">
                        {generalError && <p className="text-red-500 mb-4">{generalError}</p>}
                            <div className='w-[350px] my-2 mx-4'>
                                <label className="block font-semibold">First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={updatedUserData.firstName || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                                {fieldErrors.firstName && (
                                    <p className="text-red-500 mt-1">{fieldErrors.firstName}</p>
                                )}
                            </div>
                            <div className='w-[350px] my-2 mx-4'>
                                <label className="block font-semibold">Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={updatedUserData.lastName || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                                {fieldErrors.lastName && (
                                    <p className="text-red-500 mt-1">{fieldErrors.lastName}</p>
                                )}
                            </div>
                            <div className='w-[350px] my-2 mx-4'>
                                <label className="block font-semibold">Username:</label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={updatedUserData.userName || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                                {fieldErrors.userName && (
                                    <p className="text-red-500 mt-1">{fieldErrors.userName}</p>
                                )}
                            </div>
                            <div className='w-[350px] my-2 mx-4'>
                                <label className="block font-semibold">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={updatedUserData.email || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                                {fieldErrors.email && (
                                    <p className="text-red-500 mt-1">{fieldErrors.email}</p>
                                )}
                            </div>
                            {['password', 'newPassword', 'newRePassword'].map((field, index) => (
                                <div key={index} className='w-[350px] my-2 mx-4 relative'>
                                    <label className="block font-semibold">
                                        {field === 'password' ? 'Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}:
                                    </label>
                                    <input
                                        type={showPassword[field] ? 'text' : 'password'}
                                        name={field}
                                        value={updatedUserData[field] || ''}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded w-full"
                                    />
                                    <span
                                        onClick={() => togglePasswordVisibility(field)}
                                        className="absolute top-10 right-3 cursor-pointer"
                                    >
                                        {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    {fieldErrors[field] && (
                                        <p className="text-red-500 mt-1">{fieldErrors[field]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button
                                onClick={handleUpdateUser}
                                variant="secondary"
                                className="mx-4 my-2"
                            >
                                Update User
                            </Button>
                    </div>
                )}
            </section>

            {/* Toast Notification */}
            <div id="toast" className="toast">
                {toastMessage}
            </div>
            <UpdateUser userData={userData} userRole={userRole} />
        </main>
    );
};

export default Setting;
