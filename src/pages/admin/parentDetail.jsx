import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { api } from '@/utils/axios';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

function ParentDetail() {
  const location = useLocation();
  const { parent } = location.state; 

  const [students, setStudents] = useState(parent.students);
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

  // Function to handle editing a student
  const handleEditStudent = (student) => {
    setIsEditMode(true);
    setEditStudentId(student.id);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: new Date(student.dateOfBirth).toISOString().split('T')[0],
      gender: student.gender,
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleAddStudent = () => {
    setIsEditMode(false);
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api().delete(`/Student/${studentId}`);
        setStudents((prev) => prev.filter((student) => student.id !== studentId));
      } catch (error) {
      }
    }
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
    const { firstName, lastName, dateOfBirth, gender, file } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append('FirstName', firstName);
    formDataToSend.append('LastName', lastName);
    formDataToSend.append('DateOfBirth', dateOfBirth);
    formDataToSend.append('Gender', gender);
    formDataToSend.append('ParentId', parent.id); 

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
            student.id === editStudentId
              ? { ...student, ...formData, fileName: file ? URL.createObjectURL(file) : student.fileName }
              : student
          )
        );
      } else {
        const response = await api().post('/Student', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setStudents((prev) => [...prev, response.data]); 
      }
      handleCloseModal();
    } catch (error) {
    }
  };

  return (
    <main className="container mx-auto p-4">
      <section className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">{`Ad Soyad: ${parent.appUserFirstName} ${parent.appUserLastName}`}</h2>
        <b>Address: </b><span>{parent.adress}</span> <br />
        <b>Qohumluq əlaqəsi: </b><span>{parent.relationToStudent}</span>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Students</h3>

          <Button variant="secondary" onClick={handleAddStudent}>
            Add New Student
          </Button>

          <div className="overflow-x-auto mt-4">
            <table className="w-full my-0 align-middle text-dark border-neutral-200">
              <thead className="align-bottom">
                <tr className="font-semibold text-[0.95rem] text-secondary-dark">
                  <th className="pb-3 text-start min-w-[110px]">Şəkil</th>
                  <th className="pb-3 text-start min-w-[110px]">Ad və Soyad</th>
                  <th className="pb-3 text-start min-w-[110px]">Doğum tarixi</th>
                  <th className="pb-3 text-start min-w-[110px]">Cinsiyəti</th>
                  <th className="pb-3 text-start min-w-[110px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="p-3">
                      <img src={student.fileName} alt={student.firstName} className="w-[50px] h-[50px] rounded-lg" />
                    </td>
                    <td className="p-3">{`${student.firstName} ${student.lastName}`}</td>
                    <td className="p-3">{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                    <td className="p-3">{student.gender}</td>
                    <td className="p-3">
                      <FaEdit
                        className="inline-block mr-2 text-blue-600 cursor-pointer"
                        onClick={() => handleEditStudent(student)}
                      />
                      <MdDelete
                        className="inline-block text-red-600 cursor-pointer"
                        onClick={() => handleDeleteStudent(student.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

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
          </div>
          <div className="mb-1">
            <label className="block mb-1">Şəkil</label>
            <input type="file" name="file" onChange={handleFormChange} className="w-full border p-1 rounded" />
          </div>
          <div className="text-center my-2">
            <Button variant="secondary">{isEditMode ? 'Yenilə' : 'Əlavə et'}</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}

export default ParentDetail;
