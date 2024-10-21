import React, { useState, useEffect } from 'react';
import { api } from '@/utils/axios'; 
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';

const FeesPage = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]); 
  const [groups, setGroups] = useState([]); 
  const [date, setDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setModalOpen] = useState(false); 
  const [formData, setFormData] = useState({
    studentId: '',
    groupId: '',
    amount: 0
  });
  const [selectedStudent, setSelectedStudent] = useState(null); 

  const fetchStudents = async () => {
    try {
      const response = await api().get('/Student');
      setStudents(response.data);
    } catch (error) {
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await api().get('/Group/all', { params: { page: 1 } });
      setGroups(response.data.items);
    } catch (error) {
    }
  };

  const fetchFees = async (date = '', text = '') => {
    setLoading(true);
    setError('');

    try {
      const response = await api().get('/Fee', {
        params: {
          date: date || '',
          text: text || '',
        },
      });
      setFees(response.data);
    } catch (error) {
      setError('Error fetching fees');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    const student = students.find((s) => s.id === parseInt(studentId));
    setSelectedStudent(student);
    setFormData({
      ...formData,
      studentId: studentId,
      groupId: student?.group?.id || '',
      amount: student?.group?.price || 0,
    });
  };

  const openModal = () => {
    setModalOpen(true);
    fetchStudents(); 
    fetchGroups(); 
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ studentId: '', groupId: '', amount: 0 });
  };

  useEffect(() => {
    fetchFees(); 
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFees(date, searchText); 
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
  
    try {
      await api().post(`/Fee/${formData.groupId}`, {
        amount: formData.amount,
        studentId: formData.studentId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      closeModal(); 
      fetchFees(); 
    } catch (error) {
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Fees</h2>
      </header>
<div className="flex justify-between px-5">
<form className="flex gap-3 mt-4" onSubmit={handleSearch}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by student name..."
          className="px-3 py-2 border rounded-lg"
        />
        <Button variant="outline">
          Search
        </Button>
      </form>
      <Button variant="pill" onClick={openModal} className="mt-4">
        Create Fee
      </Button>
</div>
      {loading && <p>Loading fees...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && fees.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-[#ed145b]">Student Name</th>
                <th className="px-4 py-2 text-left text-[#ed145b]">Amount</th>
                <th className="px-4 py-2 text-left text-[#ed145b]">Due Date</th>
                <th className="px-4 py-2 text-left text-[#ed145b]">Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id} className="border-t">
                  <td className="px-4 py-2">{`${fee.studentFirstName} ${fee.studentLastName}`}</td>
                  <td className="px-4 py-2">{fee.amount} AZN</td>
                  <td className="px-4 py-2">{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(fee.paidDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && fees.length === 0 && <p>No fees found.</p>}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-lg font-bold mb-4">Create Fee</h2>
        <form onSubmit={handleCreateFee}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Student</label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleStudentChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Group</label>
            <select
              name="groupId"
              value={formData.groupId}
              onChange={handleFormChange}
              disabled={selectedStudent && selectedStudent.group}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              {selectedStudent?.group ? (
                <option value={selectedStudent.group.id}>
                  {selectedStudent.group.name}
                </option>
              ) : (
                <>
                  <option value="">Select a group</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <Button variant="primary" type="submit">
            Create
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default FeesPage;
