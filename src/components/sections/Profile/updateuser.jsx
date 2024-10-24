import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const UpdateUser = () => {
    const { userData, userRole, authToken } = useOutletContext();
    const [updatedUserData, setUpdatedUserData] = useState({});
    const [toastMessage, setToastMessage] = useState('');
    const [newParentData, setNewParentData] = useState({
        adress: '',
        relationToStudent: '',
        appUserId: ''
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
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

    const handleNewParentChange = (e) => {
        const { name, value } = e.target;
        setNewParentData((prev) => ({
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

    const handleCreateParent = async (e) => {
        e.preventDefault();
        const decodedToken = jwtDecode(authToken);
        const appUserId = decodedToken.nameid;

        try {
            const response = await api().post('/Parent', {
                adress: newParentData.adress,
                relationToStudent: newParentData.relationToStudent,
                appUserId: appUserId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200 || response.status === 201) {
                showToast('Parent created successfully', 'success');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                showToast('Failed to create parent', 'error');
            }
        } catch (error) {
            console.log(error.response.data);

            if (error.response && error.response.data) {
                setErrors(error.response.data.errors || {});
                const errorMessage = error.response.data.message || 'Failed to create parent';
                showToast(errorMessage, 'error');
            } else {
                showToast('An unexpected error occurred.', 'error');
            }
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            if (userRole === 'parent') {
                await api().put(`/Parent/${updatedUserData.id}`, {
                    adress: updatedUserData.adress,
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
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors || {});
                showToast('Failed to update user', 'error');
            } else {
                showToast('An unexpected error occurred.', 'error');
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Əlaqələndirilmiş istifadəçi məlumatları</h2>
            <form className="gap-10 flex flex-wrap items-end" onSubmit={handleUpdateUser}>
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
                            {errors.adress && <p className="text-red-500">{errors.adress}</p>}
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
                            {errors.relationToStudent && <p className="text-red-500">{errors.relationToStudent}</p>}
                        </div>
                        <Button
                            type="submit"
                            variant="secondary"
                            className=" block font-semibold h-[40px]"
                        >
                            Yenilə
                        </Button>
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
                                {errors.Instagram && <p className="text-red-500">{errors.Instagram}</p>}
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
                                {errors.Facebook && <p className="text-red-500">{errors.Facebook}</p>}
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
                                {errors.Twitter && <p className="text-red-500">{errors.Twitter}</p>}
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
                                {errors.LinkedIn && <p className="text-red-500">{errors.LinkedIn}</p>}
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
                                {errors.image && <p className="text-red-500">{errors.image}</p>}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            variant="secondary"
                            className="block font-semibold h-[40px]"
                        >
                            Yenilə
                        </Button>
                    </>
                )}
                {userRole === 'member' && (
                    <>
                        <div>
                            <label className="block font-semibold">Address:</label>
                            <input
                                type="text"
                                name="adress"
                                value={newParentData.adress || ''}
                                onChange={handleNewParentChange}
                                className="border p-2 rounded w-full"
                            />
                            {errors.adress && <p className="text-red-500">{errors.adress}</p>}
                        </div>
                        <div>
                            <label className="block font-semibold">Relation to Student:</label>
                            <select
                                id="relationToStudent"
                                name="relationToStudent"
                                className="border p-2 rounded w-full"
                                value={newParentData.relationToStudent || ''}
                                onChange={handleNewParentChange}
                            >
                                <optgroup label="Valideyn">
                                    <option value="Ata">Ata</option>
                                    <option value="Ana">Ana</option>
                                    <option value="Nənə">Nənə</option>
                                    <option value="Baba">Baba</option>
                                </optgroup>
                            </select>
                            {errors.RelationToStudent && <p className="text-red-500">{errors.RelationToStudent}</p>}
                        </div>
                        <Button
                            type="button"
                            variant="secondary"
                            className=" block font-semibold h-[40px] "
                            onClick={handleCreateParent}
                        >
                            Valideyn yarat
                        </Button>
                    </>
                )}
            </form>

            <div id="toast" className="toast">
                {toastMessage}
            </div>
        </div>
    );
};

export default UpdateUser;
