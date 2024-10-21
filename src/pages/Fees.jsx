import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '@/utils/axios'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ModalPayment from '@/components/ui/ModalPayment';
import CheckoutForm from '@/components/ui/CheckoutForm';

const stripePromise = loadStripe('pk_test_51Q6f8OBwBCJxjGyAtkwvQQfKnRrV3U8kItftfwSoWvtTTtSuVgIS3m5NxRuEPUjXlQQHn0dLGIxQSLxMO1yCBHGi00ScXan2uE');

const FeesPage = () => {
  const { userData, userRole, authToken } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(0);

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
          setError('');
        }
      };

      fetchStudents();
    }
  }, [userRole, userData, authToken]);

  const handleStudentSelect = async (studentId) => {
    setError('');
    const student = students.find((student) => student.id === parseInt(studentId, 10));

    if (student?.fees) {
      setSelectedStudent(student);
    } else {
      try {
        const response = await api().get(`/Student/${studentId}`);
        if (response.data) {
          setSelectedStudent(response.data);
        } else {
          setError('Failed to load student details.');
        }
      } catch (errors) {
        setError('Failed to fetch student details.');
      }
    }
    setCurrentPage(1);

    if (!student?.group) {
      try {
        const response = await api().get(`/Group/all`);
        setGroups(response.data.items || []);
      } catch (errors) {
        setError('Failed to fetch groups.');
      }
    } else {
      setGroups([]);
    }
  };

  const handleOpenPaymentModal = () => {
    if (!selectedStudent) {
      setError('Please select a student first.');
      return;
    }

    const groupId = selectedStudent.group ? selectedStudent.group.id : selectedGroupId;

    if (!groupId) {
      setError('Please select a group for the student.');
      return;
    }

    const selectedAmount = selectedStudent.group
      ? selectedStudent.group.price
      : groups.find(g => g.id === parseInt(groupId, 10)).price;

    setAmount(selectedAmount);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      if (!selectedStudent) {
        setError('No student selected for payment.');
        return;
      }
  
      const groupId = selectedStudent.group ? selectedStudent.group.id : selectedGroupId;
  
      const response = await api().post( `/Fee/create-fee`,
        {
          amount,
          studentId: selectedStudent.id,
          paymentIntentId,
          groupId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const newFee = response.data;
      setSelectedStudent((prevStudent) => ({
        ...prevStudent,
        fees: [newFee, ...(prevStudent.fees || [])],
      }));
  
      alert('Fee created successfully.');
      setIsModalOpen(false);
    } catch (errors) {
      console.log(errors);
      setError('Failed to create fee.');
    }
  };
  
  

  const indexOfLastFee = currentPage * itemsPerPage;
  const indexOfFirstFee = indexOfLastFee - itemsPerPage;
  const currentFees = selectedStudent?.fees ? selectedStudent.fees.slice(indexOfFirstFee, indexOfLastFee) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main className="md:ml-64 p-6 py-1 flex-1">
      <section className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Aylıq ödəniş səhifəsi</h2>

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
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div className="mb-4">
            {selectedStudent.group ? (
              <div>
                <label className="block mb-2 font-semibold">Qrup:</label>
                <span className="block border p-2 rounded w-full">
                  {selectedStudent.group.name} (qiymət: ${selectedStudent.group.price})
                </span>
              </div>
            ) : (
              <div>
                <label className="block mb-2 font-semibold">Qrup seçin:</label>
                <select
                  className="border p-2 rounded w-full"
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    -- Qrup seçin: --
                  </option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} (qiymət: ${group.price})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {selectedStudent && selectedStudent.fees && selectedStudent.fees.length > 0 ? (
          <div className="mt-4 p-4 border rounded shadow-lg">
            <h3 className="font-semibold text-xl mb-2">
               {selectedStudent.firstName} {selectedStudent.lastName} üçün ödəniş tarixçəsi
            </h3>
            <table className="w-full mt-4 border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2">Məbləğ</th>
                  <th className="border border-gray-200 p-2">Bitmə vaxtı</th>
                  <th className="border border-gray-200 p-2">Ödəniş vaxtı</th>
                </tr>
              </thead>
              <tbody>
                {currentFees.map((fee, index) => (
                  <tr key={index}>
                    <td className="border border-gray-200 p-2">${fee.amount}</td>
                    <td className="border border-gray-200 p-2">{new Date(fee.dueDate).toLocaleDateString()}</td>
                    <td className="border border-gray-200 p-2">
                      {fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : 'Not Paid'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-4">
              {selectedStudent.fees.length > itemsPerPage && (
                <div className="flex space-x-2">
                  {Array.from({ length: Math.ceil(selectedStudent.fees.length / itemsPerPage) }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : selectedStudent ? (
          <p className="mt-4">Seçilmiş uşaq üçün hər hansı bir ödəniş yoxdur</p>
        ) : null}

        {selectedStudent && (
          <div className="mt-6">
            <button
              onClick={handleOpenPaymentModal}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Ödəniş et
            </button>
          </div>
        )}

        {isModalOpen && selectedStudent && (
          <ModalPayment isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                amount={amount}
                studentId={selectedStudent.id}
                groupId={selectedGroupId || selectedStudent.group?.id}
                authToken={authToken}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </Elements>
          </ModalPayment>
        )}
      </section>
    </main>
  );
};

export default FeesPage;
