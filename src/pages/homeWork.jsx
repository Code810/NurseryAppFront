import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import Modal from '@/components/ui/modal';
import { api } from '@/utils/axios';

const HomeWork = () => {
    const { userData, userRole, authToken } = useOutletContext();
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [homeworks, setHomeworks] = useState([]);
    const [selectedHomework, setSelectedHomework] = useState(null);
    const [homeworkSubmissionData, setHomeworkSubmissionData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userRole === 'parent' && userData?.id) {
            const parentId = userData.id;

            const fetchStudents = async () => {
                try {
                    const response = await api().get(`/Student?parentId=${parentId}`);
                    if (response.data && response.data.length > 0) {
                        setStudents(response.data);
                        setError('');
                    } else {
                        setError('No students found.');
                    }
                } catch (errors) {
                    setError('Failed to fetch students.');
                    console.error('Error fetching students:', errors);
                }
            };

            fetchStudents();
        }
    }, [userRole, userData, authToken]);

    const handleStudentSelect = async (studentId) => {
        setError('');
        const student = students.find((student) => student.id === parseInt(studentId, 10));
        setSelectedStudent(student);
        setHomeworks([]);

        if (student?.group?.id) {
            try {
                const response = await api().get(`/HomeWork?groupId=${student.group.id}`);
                setHomeworks(response.data);
            } catch (errors) {
                setError('');
                console.error('Error fetching homework:', errors);
            }
        } else {
            setError('Selected student does not have a group.');
        }
    };

    const handleViewHomework = async (homeworkId) => {
        setError('');
        setSelectedHomework(homeworks.find(h => h.id === homeworkId)); // Get homework details
        setIsModalOpen(true);

        try {
            const response = await api().get(`/HomeWorkSubmission/homeWork/${homeworkId}?studentId=${selectedStudent.id}`);
            setHomeworkSubmissionData(response.data);

        } catch (errors) {
            setError('');
            console.error('Error fetching homework submission data:', errors);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setHomeworkSubmissionData([]);
        setSelectedHomework(null);
    };

    return (
        <main className="md:ml-64 p-6 py-1 flex-1">
            <section className="mt-6 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold mb-4">Ev Tapşırığı</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Uşağı seçin</label>
                    <select
                        className="border p-2 rounded w-full"
                        onChange={(e) => handleStudentSelect(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            -- Uşağı seçin --
                        </option>
                        {students?.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.firstName} {student.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                {homeworks.length > 0 && (
                    <div className="mt-4 p-4 border rounded shadow-lg">
                        <h3 className="font-semibold text-xl mb-2">
                            {selectedStudent?.firstName} {selectedStudent?.lastName} üçün ev tapşırıqları
                        </h3>
                        <table className="w-full mt-4 border-collapse border border-gray-200 text-center">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-200 p-2">Tapşırıq adı</th>
                                    <th className="border border-gray-200 p-2">Təsvir</th>
                                    <th className="border border-gray-200 p-2">Verilmə Tarixi</th>
                                    <th className="border border-gray-200 p-2">Bitmə Tarixi</th>
                                    <th className="border border-gray-200 p-2">Ətraflı</th>
                                </tr>
                            </thead>
                            <tbody>
                                {homeworks.map((homework, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-200 p-2">{homework.title}</td>
                                        <td className="border border-gray-200 p-2">
                                            {homework.description.length > 10
                                                ? `${homework.description.slice(0, 10)}...`
                                                : homework.description}
                                        </td>
                                        <td className="border border-gray-200 p-2">{new Date(homework.createdDate).toLocaleDateString()}</td>
                                        <td className="border border-gray-200 p-2">{new Date(homework.dueDate).toLocaleDateString()}</td>
                                        <td className="p-[14px] flex justify-center  border-b border-gray-200">
                                            <FaEye
                                                className="cursor-pointer"
                                                onClick={() => handleViewHomework(homework.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedStudent && homeworks.length === 0 && (
                    <p className="mt-4">Seçilmiş uşaq üçün hər hansı bir ev tapşırığı yoxdur</p>
                )}
            </section>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className="">
                        <h2 className="text-2xl font-bold mb-4 text-blue-700 border-b border-gray-200 pb-2">
                            Ev Tapşırığı Ətraflı
                        </h2>

                        {selectedHomework && (
                            <div className="mb-2 p-4 bg-blue-50 rounded-lg shadow-inner">
                                <div className="text-gray-800 space-y-3">
                                    <table className="w-full mb-4 bg-blue-50 rounded-lg text-center">
                                        <thead>
                                            <tr>
                                                <th className="border border-blue-200  text-blue-800">Tapşırıq Adı</th>
                                                <th className="border border-blue-200   text-blue-800">Verilmə Tarixi</th>
                                                <th className="border border-blue-200   text-blue-800">Bitmə Tarixi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                           <tr>
                                           <td className="border border-blue-200 text-gray-800">{selectedHomework.title}</td>
                                            <td className="border border-blue-200  text-gray-800">
                                                {new Date(selectedHomework.createdDate).toLocaleDateString()}
                                            </td>
                                            <td className="border border-blue-200  text-gray-800">
                                                {new Date(selectedHomework.dueDate).toLocaleDateString()}
                                            </td>
                                           </tr>
                                        </tbody>
                                    </table>
                                    <p>
                                        <strong className="text-blue-800">Təsvir:</strong>{" "}
                                        {selectedHomework.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mb-2">
                            <h3 className="text-lg font-bold mb-2 text-green-700 border-b border-gray-200 pb-1">
                                Tapşırıq Təqdimatı
                            </h3>
                            {homeworkSubmissionData.length > 0 ? (
                                homeworkSubmissionData.map((submission, index) => (
                                    <div
                                        key={index}
                                        className="mb-1 p-2 bg-green-50 rounded-lg shadow-inner border-t border-green-300"
                                    >
                                        <table className="w-full mb-4 bg-blue-50 rounded-lg text-center">
                                            <thead >
                                                <tr>
                                                    <th className="border border-blue-200  text-left text-blue-800">Tələbə adı</th>
                                                    <th className="border border-blue-200  text-left text-blue-800">T/E Tarixi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                <td className="border border-blue-200  text-gray-800">{submission.studentFirstName} {submission.studentLastName}</td>
                                                <td className="border border-blue-200  text-gray-800">
                                                    {new Date(submission.submissionDate).toLocaleDateString()}
                                                </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <p className='text-center p-2'>
                                            <span className="text-red-900 text-[35px] font-bold ">
                                                {submission.grade} bal
                                            </span>
                                        </p>
                                        <p>
                                            <strong className="text-green-800">Rəy:</strong>{" "}
                                            {submission.feedBack}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Tapşırığın qiymətlənməsi gözlənilir...</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                            >
                                Bağla
                            </button>
                        </div>
                    </div>
                </Modal>

            )}
        </main>
    );
};

export default HomeWork;
