import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/axios';

const UpdateUser = () => {
    const { userData, userRole, authToken } = useOutletContext();
    const [updatedUserData, setUpdatedUserData] = useState({});
    const [toastMessage, setToastMessage] = useState('');
    useEffect(() => {
        if (userData) {
            setUpdatedUserData(userData);
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        try {
            if (userRole === 'parent') {
                await api().put(`/Parent/${updatedUserData.id}`, {
                    address: updatedUserData.adress,
                    relationToStudent: updatedUserData.relationToStudent,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                showToast('Parent updated successfully', 'success');
            } else if (userRole === 'teacher') {
                const formData = new FormData();
                formData.append('Instagram', updatedUserData.instagram);
                formData.append('Facebook', updatedUserData.facebook);
                formData.append('Twitter', updatedUserData.twitter);
                formData.append('LinkedIn', updatedUserData.linkedin);

                if (updatedUserData.image) {
                    formData.append('File', updatedUserData.image);
                }

                await api().put(`/teacher/${updatedUserData.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showToast('Teacher updated successfully', 'success');

            }
        } catch (error) {
            console.error('Error updating user:', error);
            showToast('Failed to update user', 'error');
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Update User Data</h2>
            <form className="gap-10 flex flex-wrap" onSubmit={handleUpdateUser}>
                {userRole === 'parent' && (
                    <>
                        <div>
                            <label className="block font-semibold">Address:</label>
                            <input
                                type="text"
                                name="adress"
                                value={updatedUserData.adress || ''}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Relation to Student:</label>
                            <select
                                id="relationToStudent"
                                name="relationToStudent"
                                className="border p-2 rounded w-full"
                                value={updatedUserData.relationToStudent || ''}
                                onChange={handleInputChange}
                            >
                                <optgroup label="Valideyn">
                                    <option value="Ata">Ata</option>
                                    <option value="Ana">Ana</option>
                                    <option value="Nənə">Nənə</option>
                                    <option value="Baba">Baba</option>
                                </optgroup>
                            </select>
                        </div>
                    </>
                )}
                {userRole === 'teacher' && (
                    <>
                        <div>
                            <img
                                src={updatedUserData.fileName}
                                alt={updatedUserData.firstName}
                                className='w-[50%]'
                            />
                        </div>
                        <div className='flex flex-wrap gap-5'>
                            <div>
                                <label className="block font-semibold">Instagram:</label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={updatedUserData.instagram || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Facebook:</label>
                                <input
                                    type="text"
                                    name="facebook"
                                    value={updatedUserData.facebook || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Twitter:</label>
                                <input
                                    type="text"
                                    name="twitter"
                                    value={updatedUserData.twitter || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">LinkedIn:</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={updatedUserData.linkedin || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Profile Picture:</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setUpdatedUserData((prev) => ({ ...prev, image: file }));
                                    }}
                                    className="border p-1 rounded w-[80%]"
                                />
                            </div>
                        </div>
                    </>
                )}
                <Button
                    type="submit"
                    variant="secondary"
                    className=" mb-3"
                >
                    Update User
                </Button>
            </form>

            <div id="toast" className="toast">
                {toastMessage}
            </div>
        </div>
    );
};

export default UpdateUser;
