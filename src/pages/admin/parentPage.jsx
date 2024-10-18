import React, { useState, useEffect } from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Modal from '@/components/ui/modal';
import { api } from '@/utils/axios';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function Parents() {
  const [parents, setParents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [formData, setFormData] = useState({
    adress: '',
    relationToStudent: ''
  });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const navigate = useNavigate();

  const fetchParents = async (text = '', page = 1) => {
    try {
      const response = await api().get('/Parent', {
        params: {
          text: text,
          page: page,
        },
      });
      setParents(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      setParents([]);
    }
  };

  useEffect(() => {
    fetchParents(searchText, currentPage);
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

  const handleDelete = async (parentId) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      try {
        await api().delete(`/Parent/${parentId}`);
        setParents(parents.filter((parent) => parent.id !== parentId));
        showToast('Parent deleted successfully!', 'success');
      } catch (error) {
        showToast('Failed to delete parent', 'error');
      }
    }
  };

  const openEditModal = (parent) => {
    setSelectedParent(parent);
    setFormData({
      adress: parent.adress || '',
      relationToStudent: parent.relationToStudent || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedParent(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParent) return;

    try {
      const response = await api().put(
        `/Parent/${selectedParent.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const updatedParents = parents.map((parent) =>
          parent.id === selectedParent.id
            ? { ...parent, ...formData }
            : parent
        );
        setParents(updatedParents);
        showToast('Parent updated successfully!', 'success');
        closeModal();
      }
    } catch (error) {
      showToast('Failed to update parent.', 'error');
    }
  };

  const handleViewDetail = (parent) => {
    navigate('/admin/parentDetail', { state: { parent } });
  };

  return (
    <div className="container mx-auto p-4">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Valideynlər</h2>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Axtar"
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
                  <div className="font-bold text-left text-[#ed145b]">Ünvan</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-bold text-left text-[#ed145b]">Qohumluq əlaqəsi</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-bold text-center text-[#ed145b]">Əlavələr</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {parents.map((parent) => (
                <tr key={parent.id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">
                      {parent.appUserFirstName} {parent.appUserLastName}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{parent.adress}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{parent.relationToStudent}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap text-center">
                    <FaEye className="inline-block mr-2 cursor-pointer" onClick={() => handleViewDetail(parent)} />
                    <FaEdit className="inline-block mr-2 text-[#0d8ba4] cursor-pointer" onClick={() => openEditModal(parent)} />
                    <MdDelete className="inline-block text-[#ff466f] cursor-pointer" onClick={() => handleDelete(parent.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedParent && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-4">Update Parent</h2>
            <div className="mb-2">
              <label className="block font-bold mb-1">Address</label>
              <input
                type="text"
                name="adress"
                value={formData.adress}
                onChange={handleChange}
                className="w-full px-3 py-1 border rounded-lg"
              />
            </div>
            <div className="mb-2">
              <label className="block font-bold mb-1">Relation to Student</label>
              <input
                type="text"
                name="relationToStudent"
                value={formData.relationToStudent}
                onChange={handleChange}
                className="w-full px-3 py-1 border rounded-lg"
              />
            </div>
            <div className="text-center">
              <Button variant="secondary" className="px-4 py-2">
                Update Parent
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

export default Parents;
