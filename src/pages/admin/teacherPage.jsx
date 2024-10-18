import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Modal from '@/components/ui/modal';
import { api } from '@/utils/axios';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function TeacherPage() {
  const [teachers, setTeachers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    file: null
  });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const fetchTeachers = async (text = '', page = 1) => {
    try {
      const response = await api().get('/Teacher/all', {
        params: {
          text: text,
          page: page,
        },
      });
      setTeachers(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      setTeachers([]);
    }
  };

  useEffect(() => {
    fetchTeachers(searchText, currentPage);
  }, [searchText, currentPage]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    const toast = document.getElementById('toast');
    toast.className = `toast show ${type}`;
    setTimeout(() => {
      toast.className = toast.className.replace('show', '');
      setToastMessage('');
    }, 3000);
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api().delete(`/Teacher/${teacherId}`);
        setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
        showToast('Teacher deleted successfully!', 'success');
      } catch (error) {
        showToast('Failed to delete teacher', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      instagram: teacher.instagram || '',
      facebook: teacher.facebook || '',
      twitter: teacher.twitter || '',
      linkedin: teacher.linkedin || '',
      file: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    const formDataToSend = new FormData();
    formDataToSend.append('Instagram', formData.instagram);
    formDataToSend.append('Facebook', formData.facebook);
    formDataToSend.append('Twitter', formData.twitter);
    formDataToSend.append('Linkedin', formData.linkedin);
    if (formData.file) {
      formDataToSend.append('File', formData.file);
    }

    try {
      const response = await api().put(
        `/Teacher/${selectedTeacher.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        const updatedTeachers = teachers.map((teacher) =>
          teacher.id === selectedTeacher.id
            ? { ...teacher, ...formData }
            : teacher
        );
        setTeachers(updatedTeachers);
        showToast('Teacher updated successfully!', 'success');
        closeModal();
      }
    } catch (error) {
      showToast('Failed to update teacher.', 'error');
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / 10);
    return (
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`mx-1 px-3 py-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
      <div className='text-end'>
      <Link to="/admin/teacherCreate">
      <Button variant="pill" className=" px-4 py-2 ">
               Müəllim yaratmaq
              </Button>
              </Link>
      </div>
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Müəllimlər</h2>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search teachers..."
          className="mt-2 px-3 py-1 border rounded-lg w-full"
        />
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-bold text-left text-[#ed145b]">Ad Soyad</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-bold text-left text-[#ed145b]">Group Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-bold text-left text-[#ed145b]">Social Media</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-bold text-center text-[#ed145b]">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="p-2 whitespace-nowrap">
                    
                  <div className="flex items-center gap-3">
              <div className="relative inline-block shrink-0 rounded-2xl mr-3">
                <img
                  src={teacher.fileName}
                  className="w-[50px] h-[50px] inline-block shrink-0 rounded-2xl"
                  alt={`${teacher.firstName} ${teacher.lastName}`}
                />
              </div>
              <div className="text-left">{teacher.firstName} {teacher.lastName}</div>
            </div>

                   
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{teacher.groupName || 'yoxdur'}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {teacher.instagram && (
                        <a href={teacher.instagram} target="_blank" rel="noopener noreferrer">
                          <FaInstagram className="text-pink-500" />
                        </a>
                      )}
                      {teacher.facebook && (
                        <a href={teacher.facebook} target="_blank" rel="noopener noreferrer">
                          <FaFacebook className="text-blue-600" />
                        </a>
                      )}
                      {teacher.twitter && (
                        <a href={teacher.twitter} target="_blank" rel="noopener noreferrer">
                          <FaTwitter className="text-blue-400" />
                        </a>
                      )}
                      {teacher.linkedin && (
                        <a href={teacher.linkedin} target="_blank" rel="noopener noreferrer">
                          <FaLinkedin className="text-blue-700" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap text-center">
                    <FaEdit className="inline-block mr-2 text-[#0d8ba4] cursor-pointer" onClick={() => openEditModal(teacher)} />
                    <MdDelete className="inline-block text-[#ff466f] cursor-pointer" onClick={() => handleDelete(teacher.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {renderPagination()}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedTeacher && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-4">Update Teacher</h2>
              <div className="mb-2">
                <label className="block font-bold mb-1">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border rounded-lg"
                />
              </div>
              <div className="mb-2">
                <label className="block font-bold mb-1">Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border rounded-lg"
                />
              </div>
              <div className="mb-2">
                <label className="block font-bold mb-1">Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border rounded-lg"
                />
              </div>
              <div className="mb-2">
                <label className="block font-bold mb-1">LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border rounded-lg"
                />
              </div>
              <div className="mb-2">
                <label className="block font-bold mb-1">Profile Picture</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="w-full px-3 py-1 border rounded-lg"
                />
              </div>
             <div className='text-center'>
             <Button variant="secondary" className=" px-4 py-2 ">
                Update Teacher
              </Button>
             </div>
            </form>
          )}
        </Modal>
      </div>

      <div id="toast" className={`toast ${toastMessage ? 'show' : ''} ${toastType}`}>
        {toastMessage}
      </div>
    </div>
  );
}

export default TeacherPage;
