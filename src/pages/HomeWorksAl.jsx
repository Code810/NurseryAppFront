import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom'; 
import { FaEdit, FaEye } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { api } from '@/utils/axios';

const HomeWorks = () => {
    const { userData, authToken } = useOutletContext(); 
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedHomework, setSelectedHomework] = useState(null); 
    const [errorMessage, setErrorMessage] = useState(''); 

    const navigate = useNavigate(); 

    const [homeworkData, setHomeworkData] = useState({
        title: '',
        description: '',
        dueDate: '',
    });

    useEffect(() => {
        if (userData?.groupId) {
            fetchHomeworks(userData.groupId);
        }
    }, [userData]);

    const fetchHomeworks = async (groupId) => {
        setLoading(true);
        setErrorMessage(''); 
        try {
            const response = await api().get(`/HomeWork`, {
                params: {
                    groupId: groupId,
                },
            });
            setHomeworks(response.data);
            setLoading(false);
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setSelectedHomework(null);
        setHomeworkData({
            title: '',
            description: '',
            dueDate: '',
        });
        setErrorMessage(''); 
        setModalOpen(true);
    };

    const openEditModal = (homework) => {
        setSelectedHomework(homework);
        setHomeworkData({
            title: homework.title,
            description: homework.description,
            dueDate: homework.dueDate.split('T')[0]
        });
        setErrorMessage(''); 
        setModalOpen(true);
    };

    const handleSaveHomework = async (e) => {
        e.preventDefault(); 
        setErrorMessage(''); 

        try {
            if (selectedHomework) {
                await api().put(`/HomeWork/${selectedHomework.id}`, {
                    title: homeworkData.title,
                    description: homeworkData.description,
                    dueDate: homeworkData.dueDate,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                await api().post(`/HomeWork`, {
                    title: homeworkData.title,
                    description: homeworkData.description,
                    dueDate: homeworkData.dueDate,
                    groupId: userData.groupId, 
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }

            setModalOpen(false);
            fetchHomeworks(userData.groupId);
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    };

    return (
        <main className="md:ml-64 p-6 py-1 flex-1">
            <section className="mt-6 bg-white p-6 rounded-xl shadow-md">
                <div className='flex justify-between px-5 items-center'>
                    <h2 className="text-xl font-bold mb-4">Homeworks</h2>
                    <Button variant="secondary" className="m-2" onClick={openCreateModal}>
                        Tapşırıq yarat
                    </Button>
                </div>

                {loading ? (
                    <p>Loading homeworks...</p>
                ) : homeworks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2">Due Date</th>
                                    <th className="px-4 py-2">Created Date</th>
                                    <th className="px-4 py-2">Group Name</th>
                                    <th className="px-4 py-2">Setting</th>
                                </tr>
                            </thead>
                            <tbody>
                                {homeworks.map((homework) => (
                                    <tr key={homework.id} className="border-t text-center">
                                        <td className="px-4 py-4 text-sm text-gray-700">{homework.title}</td>
                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            {homework.description.length > 10
                                                ? `${homework.description.slice(0, 10)}...`
                                                : homework.description}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            {new Date(homework.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            {new Date(homework.createdDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-700">{homework.groupName}</td>
                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            <div className='flex item-center gap-3 justify-center'>
                                                <FaEye
                                                    className="cursor-pointer"
                                                    onClick={() => navigate(`/Profile/homework-detail/${userData.groupId}/${homework.id}`)}
                                                />
                                                <FaEdit
                                                    className='text-[#028eaf] cursor-pointer'
                                                    onClick={() => openEditModal(homework)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No homeworks found for this group.</p>
                )}
            </section>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h2 className="text-lg font-bold mb-4">
                    {selectedHomework ? 'Tapşırığı Yenilə' : 'Yeni Tapşırıq Yarat'}
                </h2>
                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                <form className="space-y-4" onSubmit={handleSaveHomework}>
                    <div>
                        <label className="block font-semibold">Title:</label>
                        <input
                            type="text"
                            value={homeworkData.title}
                            onChange={(e) => setHomeworkData({ ...homeworkData, title: e.target.value })}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Description:</label>
                        <textarea
                            value={homeworkData.description}
                            onChange={(e) => setHomeworkData({ ...homeworkData, description: e.target.value })}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Due Date:</label>
                        <input
                            type="date"
                            value={homeworkData.dueDate}
                            onChange={(e) => setHomeworkData({ ...homeworkData, dueDate: e.target.value })}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <Button variant="secondary" type="submit">
                        {selectedHomework ? 'Yenilə' : 'Yarat'}
                    </Button>
                </form>
            </Modal>
        </main>
    );
};

export default HomeWorks;
