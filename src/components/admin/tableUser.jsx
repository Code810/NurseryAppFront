import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import Modal from '../ui/modal';
import { Button } from '../ui/button';
import { api } from '@/utils/axios';

function TableUsers({ users, setUsers }) { 
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: ''
  });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const openModal = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      password: '' 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await api().put(`AppUser/${selectedUser.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200) {
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers); 
        showToast('User updated successfully!', 'success');
        closeModal(); 
      }
    } catch (error) {
      showToast('Failed to update user.', 'error');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await api().delete(`AppUser/${userId}`);

      if (response.status === 200) {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers); 
        showToast('User deleted successfully!', 'success');
      }
    } catch (error) {
      showToast('Failed to delete user.', 'error');
    }
  };

  const confirmDelete = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(userId); 
      }
    });
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">İstifadəçilər</h2>
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
                  <div className="font-bold text-left text-[#ed145b]">İstifadəçi adı</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-bold text-left text-[#ed145b]">Email</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-bold text-center text-[#ed145b]">Status</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-bold text-center text-[#ed145b]">Tənizmləmələr</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{user.userName}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{user.email}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      {user.roles?.includes('admin') && (
                        <span className="bg-green-400 px-2 text-white rounded-lg">Admin</span>
                      )}
                      {user.roles?.includes('teacher') && (
                        <span className="bg-blue-400 px-2 text-white rounded-lg">Müəllim</span>
                      )}
                      {user.roles?.includes('parent') && (
                        <span className="bg-red-400 px-2 text-white rounded-lg">Valideyn</span>
                      )}
                      {!user.roles?.includes('admin') &&
                        !user.roles?.includes('teacher') &&
                        !user.roles?.includes('parent') && (
                          <span className="text-gray-500">Üzv</span>
                        )}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-lg text-center">
                      <FaEdit className="inline-block mr-2 text-[#0d8ba4] cursor-pointer" onClick={() => openModal(user)} />
                      <MdDelete className="inline-block text-[#ff466f] cursor-pointer" onClick={() => confirmDelete(user.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedUser && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-4">Update User</h2>
            <div className="mb-4">
              <label className="block font-bold mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-1 border rounded-lg"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block font-bold mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-1 border rounded-lg"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block font-bold mb-1">Username</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-3 py-1 border rounded-lg"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block font-bold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-1 border rounded-lg"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block font-bold mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-1 border rounded-lg"
              />
            </div>
            <div className="text-center">
              <Button variant="outline" className="px-4 py-2">
                Update User
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <div id="toast" className={`toast ${toastMessage ? 'show' : ''} ${toastType}`}>
        {toastMessage}
      </div>
    </div>
  );
}

export default TableUsers;
