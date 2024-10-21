import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { api } from '@/utils/axios'; 
import Select from 'react-select';
import { useNavigate } from 'react-router-dom'; 
import { FaChildren } from 'react-icons/fa6';
import { MdAddTask } from 'react-icons/md';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    minAge: 0,
    maxAge: 0,
    price: 0,
    language: '',
    teacherId: 0,
  });

  const navigate = useNavigate(); 

  const fetchGroups = async (text = '', page = 1) => {
    try {
      const response = await api().get('/Group/all', {
        params: { text, page },
      });
      setGroups(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
    }
  };

  const fetchTeachers = async (search = '', page = 1) => {
    try {
      const response = await api().get('/Teacher/all', {
        params: { text: search, page },
      });
      const availableTeachers = response.data.items.filter((teacher) => teacher.groupId === 0); 
      setTeachers(availableTeachers); 
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchGroups(searchText, currentPage);
    fetchTeachers();
  }, [searchText, currentPage]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); 
  };

  const handleCreateGroup = () => {
    setIsModalOpen(true);
    setSelectedGroup(null);
    setFormData({
      name: '',
      roomNumber: '',
      minAge: 0,
      maxAge: 0,
      price: 0,
      language: '',
      teacherId: 0,
    });
  };

  const handleEditGroup = (group) => {
    setIsModalOpen(true);
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      roomNumber: group.roomNumber,
      minAge: group.minAge,
      maxAge: group.maxAge,
      price: group.price,
      language: group.language,
      teacherId: group.teacherId, 
    });
  };

  const handleViewDetail = (group, type) => {
    if (type === 'children') {
      navigate('/admin/groupDetail', { state: { group } });
    } else if (type === 'homework') {
      navigate('/admin/homeworks', { state: { group } });
    }
  };

  const handleDeleteGroup = async (groupId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api().delete(`/Group/${groupId}`);
          setGroups(groups.filter((group) => group.id !== groupId));
          Swal.fire('Deleted!', 'The group has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'There was a problem deleting the group.', 'error');
        }
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTeacherSelect = (selectedOption) => {
    setFormData({ ...formData, teacherId: selectedOption.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedGroup) {
        await api().put(`/Group/${selectedGroup.id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setGroups(groups.map((group) => (group.id === selectedGroup.id ? { ...group, ...formData } : group)));
      } else {
        await api().post(`/Group`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        fetchGroups();
      }
      setIsModalOpen(false);
    } catch (error) {
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Qruplar</h2>
          <Button variant="pill" onClick={handleCreateGroup}>
            Yeni Qrup Yaratmaq
          </Button>
        </div>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search groups..."
          className="mt-2 px-3 py-1 border rounded-lg w-full"
        />
      </header>

      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap text-left text-[#ed145b]">Adı</th>
                <th className="p-2 whitespace-nowrap text-left text-[#ed145b]">Otaq nömrəsi</th>
                <th className="p-2 whitespace-nowrap text-left text-[#ed145b]">Yaş aralığı</th>
                <th className="p-2 whitespace-nowrap text-left text-[#ed145b]">Dil</th>
                <th className="p-2 whitespace-nowrap text-left text-[#ed145b]">Qiymət</th>
                <th className="p-2 whitespace-nowrap text-left text-[#ed145b]">Müəllim</th>
                <th className="p-2 whitespace-nowrap text-center text-[#ed145b]">Əlavələr</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {groups.map((group) => (
                <tr key={group.id}>
                  <td className="p-2">{group.name}</td>
                  <td className="p-2">{group.roomNumber}</td>
                  <td className="p-2">{group.minAge} - {group.maxAge}</td>
                  <td className="p-2">{group.language}</td>
                  <td className="p-2">{group.price} AZN</td>
                  <td className="p-2">{`${group.teacherFirstName} ${group.teacherLastName}`}</td>
                  <td className="p-2">
                    <div className="flex justify-center space-x-2 items-center">
                    <MdAddTask className="inline-block cursor-pointer" onClick={() => handleViewDetail(group, 'homework')}  />
                      <FaChildren className="inline-block cursor-pointer" onClick={() => handleViewDetail(group, 'children')} />
                      <FaEdit
                        className="inline-block text-blue-500 cursor-pointer"
                        onClick={() => handleEditGroup(group)}
                      />
                      <FaTrash
                        className="inline-block text-red-500 cursor-pointer"
                        onClick={() => handleDeleteGroup(group.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(totalCount / 10) }, (_, index) => (
          <button
            key={index + 1}
            className={`mx-1 px-3 py-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold">{selectedGroup ? 'Update Group' : 'Create Group'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-1">
            <label className="block text-gray-700">Adı</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full px-3 py-1 border rounded-lg"
              required
            />
          </div>
          <div className="mb-1">
            <label className="block text-gray-700">Otaq nömrəsi</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleFormChange}
              className="w-full px-3 py-1 border rounded-lg"
              required
            />
          </div>
          <div className="mb-1">
            <label className="block text-gray-700">Yaş aralığı</label>
            <div className='flex gap-3'>
              <input
                type="number"
                name="minAge"
                value={formData.minAge}
                onChange={handleFormChange}
                className="w-full px-3 py-1 border rounded-lg"
                required
              />
              <input
                type="number"
                name="maxAge"
                value={formData.maxAge}
                onChange={handleFormChange}
                className="w-full px-3 py-1 border rounded-lg"
                required
              />
            </div>
          </div>
          <div className="mb-1">
            <label className="block text-gray-700">Dil</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleFormChange}
              className="w-full px-3 py-1 border rounded-lg"
              required
            >
              <option value="" disabled>
                Dili seçin
              </option>
              <option value="Azərbaycan">Azərbaycan</option>
              <option value="İngilis">İngilis</option>
              <option value="Rus">Rus</option>
            </select>
          </div>
          <div className="mb-1">
            <label className="block text-gray-700">Qiymət</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              className="w-full px-3 py-1 border rounded-lg"
              required
            />
          </div>
          <div className="mb-1">
            <label className="block text-gray-700">Müəllim</label>
            <Select
              options={teachers.map(teacher => ({ value: teacher.id, label: `${teacher.firstName} ${teacher.lastName}` }))}
              onChange={handleTeacherSelect}
              value={teachers.find((teacher) => teacher.id === formData.teacherId) ? {
                value: formData.teacherId,
                label: `${teachers.find((teacher) => teacher.id === formData.teacherId)?.firstName} ${teachers.find((teacher) => teacher.id === formData.teacherId)?.lastName}`
              } : null}
              placeholder="Müəllim seçin..."
              isSearchable // Enable search in the select dropdown
            />
          </div>
          <div className="text-center">
            <Button variant="secondary">{selectedGroup ? 'Update Group' : 'Create Group'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GroupsPage;
