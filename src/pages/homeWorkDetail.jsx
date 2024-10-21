import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Status from '@/components/ui/status';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import Modal from '@/components/ui/modal';
import { FaEdit } from 'react-icons/fa';
import { api } from '@/utils/axios';

const HomeWorkDetail = () => {
  const { groupId, homeworkId } = useParams(); 
  const [homework, setHomework] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingHomework, setLoadingHomework] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [submissionData, setSubmissionData] = useState({
    grade: '',
    feedback: '',
    submissionDate: new Date().toISOString(),
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchHomeworkDetails(homeworkId, token);
      fetchStudents(groupId, homeworkId, token);
    } else {
    }
  }, [groupId, homeworkId]);

  const fetchHomeworkDetails = async (homeworkId, token) => {
    setLoadingHomework(true);
    try {
      const response = await api().get(`/HomeWork`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          id: homeworkId,
        },
      });
      setHomework(response.data);
      setLoadingHomework(false);
    } catch (error) {
      setLoadingHomework(false);
    }
  };

  const fetchStudents = async (groupId, homeworkId, token) => {
    setLoadingStudents(true);
    try {
      const response = await api().get(`/Student/homework`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          groupId: groupId,
          homeWorkId: homeworkId,
        },
      });
      setStudents(response.data);
      setLoadingStudents(false);
    } catch (error) {
      setLoadingStudents(false);
    }
  };


  const handleCreateSubmission = (studentId) => {
    setSelectedStudent(studentId);
    setIsEditing(false); 
    setSubmissionData({
      grade: '',
      feedback: '',
      submissionDate: new Date().toISOString(),
    });
    setIsModalOpen(true); 
  };

  
  const handleEditSubmission = (student) => {
    setSelectedStudent(student.homeWorkSubmission.id);
    setIsEditing(true); 
    setSubmissionData({
      grade: student.homeWorkSubmission.grade,
      feedback: student.homeWorkSubmission.feedBack,
    });
    setIsModalOpen(true); 
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        await api().put(`/HomeWorkSubmission/${selectedStudent}`, {
          grade: submissionData.grade,
          feedBack: submissionData.feedback,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        fetchStudents(groupId, homeworkId, authToken); 
        setIsModalOpen(false); 
      } catch (error) {
      }
    } else {
      try {
        await api().post(`/HomeWorkSubmission`, {
          studentId: selectedStudent,
          homeWorkId: homeworkId,
          submissionDate: submissionData.submissionDate,
          grade: submissionData.grade,
          feedBack: submissionData.feedback,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        fetchStudents(groupId, homeworkId, authToken); 
        setIsModalOpen(false); 
      } catch (error) {
      }
    }
  };

  return (
    <main className="md:ml-64 p-6 py-1 flex-1">
      <section className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Tapşırıq haqqında</h2>

        {loadingHomework ? (
          <p>Tapşırıq məlumatları yüklənir....</p>
        ) : homework ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold"><b>Başlıq: </b>{homework.title}</h3>
            <h3 className="text-lg font-semibold"><b>Təsviri: </b>{homework.description}</h3>
            <h3 className="text-lg font-semibold"><b>Bitmə vaxtı:</b> {new Date(homework.dueDate).toLocaleDateString()}</h3>
          </div>
        ) : (
          <p>Tapşırıq tapılmadı</p>
        )}

        <h3 className="text-lg font-bold mb-4">Uşaqlar</h3>
        {loadingStudents ? (
          <p>Uşaqlar haqqında məlumatlar yüklənir....</p>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2">Ad Soyad</th>
                  <th className="px-4 py-2">Davamiyyət</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Qiymət</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {students?.map((student) => (
                  <tr key={student.id} className="border-t text-center">
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {student.attenDance?.status ? (
                        <Status
                          icon={<AiOutlineCheck />}
                          text="Dərsdə"
                          className="text-emerald-500 bg-emerald-100/60 dark:bg-gray-800"
                        />
                      ) : (
                        <Status
                          icon={<AiOutlineClose />}
                          text="Qayıb"
                          className="text-red-500 bg-red-100/60 dark:bg-gray-800"
                        />
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {student.homeWorkSubmission ? (
                        <Status
                          icon={<AiOutlineCheck />}
                          text="Təqdim edilib"
                          className="text-emerald-500 bg-emerald-100/60 dark:bg-gray-800"
                        />
                      ) : (
                        <Status
                          icon={<AiOutlineClose />}
                          text="Təqdim edilməyib"
                          className="text-red-500 bg-red-100/60 dark:bg-gray-800"
                        />
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {student.homeWorkSubmission ? (
                        <b className='bg-red-500/90 rounded-full text-white p-2 '>{student.homeWorkSubmission.grade}</b>
                      ) : (
                        <h1>---</h1>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {student.attenDance?.status && !student.homeWorkSubmission ? (
                        <Button 
                          variant="secondary"
                          onClick={() => handleCreateSubmission(student.id)}>
                          Qiymət ver
                        </Button>
                      ) : null}
                      {student.attenDance?.status && student.homeWorkSubmission ? (
                         <Button 
                           variant="outline"
                           onClick={() => handleEditSubmission(student)}>
                           Düzəliş <FaEdit />
                         </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Tapşırıq üçün tələbə tapılmadı.</p>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-lg font-bold mb-4">{isEditing ? 'Düzəliş et' : 'Qiymət ver'}</h2>
          <form onSubmit={handleSubmitGrade}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Qiymət:</label>
              <input
                type="number"
                value={submissionData.grade}
                onChange={(e) => setSubmissionData({ ...submissionData, grade: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Əlavə qeyd:</label>
              <textarea
                value={submissionData.feedback}
                onChange={(e) => setSubmissionData({ ...submissionData, feedback: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
            <Button variant="secondary" type="submit">
              {isEditing ? 'Düzəliş et' : 'Təsdiq et'}
            </Button>
          </form>
        </Modal>
      </section>
    </main>
  );
};

export default HomeWorkDetail;
