import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StudentCart from '@/components/sections/Student/studentCart';
import Modal from '@/components/ui/modal';
import { api } from '@/utils/axios';

function Students() {
  const { userData, userRole, authToken } = useOutletContext(); 
  
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    file: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);

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
        }
      };

      fetchStudents();
    }
  }, [userRole, userData, authToken]);

  const handleAddStudent = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const handleEditStudent = (student) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditStudentId(student.id);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: new Date(student.dateOfBirth).toISOString().split('T')[0],
      gender: student.gender,
      file: null,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      file: null,
    });
    setFormErrors({});
    setEditStudentId(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const parentId = userData.id;
    const { firstName, lastName, dateOfBirth, gender, file } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append('FirstName', firstName);
    formDataToSend.append('LastName', lastName);
    formDataToSend.append('DateOfBirth', dateOfBirth);
    formDataToSend.append('Gender', gender);
    formDataToSend.append('ParentId', parentId);

    if (file) {
      formDataToSend.append('File', file);
    }

    try {
      if (isEditMode) {
        await api().put(`/Student/${editStudentId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setStudents((prev) =>
          prev.map((student) =>
            student.id === editStudentId ? { ...student, ...formData, fileName: file ? URL.createObjectURL(file) : student.fileName } : student
          )
        );
      } else {
        const response = await api().post(`/Student`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setStudents((prev) => [...prev, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorsArray = error.response.data.errors;
        const errorsObject = {};

        errorsArray.forEach((err) => {
          const field = Object.keys(err)[0];
          const message = err[field];
          errorsObject[field] = message;
        });

        setFormErrors(errorsObject);
      } else {
      }
    }
  };

  const handleDeleteStudent = (studentId) => {
    setStudents((prev) => prev.filter((student) => student.id !== studentId));
  };

  return (
    <main className="md:ml-64 p-6 py-1 flex-1">
      <section className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4 me-25">
          <Button variant="secondary" onClick={handleAddStudent}>
            Add New Student
          </Button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!error && students.length > 0 && (
          <div className="overflow-x-auto px-[30px]">
            <table className="w-full my-0 align-middle text-dark border-neutral-200">
              <thead className="align-bottom">
                <tr className="font-semibold text-[0.95rem] text-secondary-dark">
                  <th className="pb-3 text-start min-w-[110px]">Şəkil</th>
                  <th className="pb-3 text-start min-w-[110px]">Ad və Soyad</th>
                  <th className="pb-3 text-start min-w-[110px]">Doğum tarixi</th>
                  <th className="pb-3 text-start min-w-[110px]">Cinsiyəti</th>
                  <th className="pb-3 text-start min-w-[110px]">Qrupu</th>
                  <th className="pb-3 text-start min-w-[110px]">Ətraflı</th>
                </tr>
              </thead>
              <StudentCart students={students} onEditStudent={handleEditStudent} onDeleteStudent={handleDeleteStudent} authToken={authToken} />
            </table>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h2 className="text-lg font-semibold mb-1">{isEditMode ? 'Tələbəni Yeniləyin' : 'Yeni uşaq əlavə etmək üçün forum'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-1">
              <label className="block mb-1">Adı</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
                className="w-full border p-1 rounded"
                required
              />
              {formErrors.FirstName && <p className="text-red-500">{formErrors.FirstName}</p>}
            </div>
            <div className="mb-1">
              <label className="block mb-1">Soyadı</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
                className="w-full border p-1 rounded"
                required
              />
              {formErrors.LastName && <p className="text-red-500">{formErrors.LastName}</p>}
            </div>
            <div className="mb-1">
              <label className="block mb-1">Doğum tarixi</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleFormChange}
                className="w-full border p-1 rounded"
                required
              />
              {formErrors.DateOfBirth && <p className="text-red-500">{formErrors.DateOfBirth}</p>}
            </div>
            <div className="mb-1">
              <label className="block mb-1">Cinsiyyəti</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleFormChange}
                className="w-full border p-1 rounded"
                required
              >
                <option value="" disabled>
                  Cinsiyyət seçin
                </option>
                <option value="qiz">Qız</option>
                <option value="oglan">Oğlan</option>
              </select>
              {formErrors.Gender && <p className="text-red-500">{formErrors.Gender}</p>}
            </div>
            <div className="mb-1">
              <label className="block mb-1">Şəkil</label>
              <input
                type="file"
                name="file"
                onChange={handleFormChange}
                className="w-full border p-1 rounded"
              />
              {formErrors.File && <p className="text-red-500">{formErrors.File}</p>}
            </div>
            <div className="text-center my-2">
              <Button variant="secondary">{isEditMode ? 'Yenilə' : 'Əlavə et'}</Button>
            </div>
          </form>
        </Modal>
      </section>
    </main>
  );
}

export default Students;
