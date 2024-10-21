import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isSameDay } from 'date-fns';
import Status from '@/components/ui/status';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { format } from 'date-fns';
import { api } from '@/utils/axios';

const AttenDance = () => {
  const { userData, authToken } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (userData && userData.groupId && selectedDate) {
        fetchStudents(userData.groupId, selectedDate);
      }
  }, [selectedDate, userData]);

  const fetchStudents = async (groupId, date) => {
    setLoading(true);
    try {
      const response = await api().get(`/Student/teacher`, {
        params: {
          groupId: groupId,
          date: date,
        },
      });
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setSelectedDate(formattedDate);
  };

  const handleAttendance = async (studentId, status) => {
    try {
      await api().post( `/AttenDance`,
        {
          studentId: studentId,
          status: status,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId ? { ...student, attenDance: { ...student.attenDance, status } } : student
        )
      );

      showToast(`Davamiyyət ${status ? 'dərsdə' : 'qayıb'} olaraq dəyişdirildi`, 'success');
    } catch (error) {
      showToast('Failed to mark attendance', 'error');
    }
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    const toast = document.getElementById('toast');
    toast.className = `toast show ${type}`;
    setTimeout(() => {
      toast.className = toast.className.replace('show', '');
      setToastMessage('');
    }, 3000);
  };

  const isToday = selectedDate ? isSameDay(new Date(), new Date(selectedDate)) : false;

  return (
    <main className="md:ml-64 p-6 py-1 flex-1">
      <section className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Dərs Jurnalı</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Tarixi seçin:</label>
          <DatePicker
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded"
            placeholderText="Select a date"
          />
        </div>

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <table className="min-w-[30%] bg-white ">
            <thead>
              <tr>
                <th className="px-4 py-2">Ad Soyad</th>
                <th className="px-4 py-2">Davamiyyət</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                    <div className="flex items-center gap-x-2">
                      <img src={student.fileName} className="object-cover w-8 h-8 rounded-full" alt="Student" />
                      <div>
                        <h2 className="text-sm font-medium text-gray-800 dark:text-white">
                          {student.firstName} {student.lastName}
                        </h2>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
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
                        className=" text-red-500  bg-red-100/60 dark:bg-gray-800"
                      />
                    )}
                  </td>
                  {isToday && (
                    <td>
                      <label className="inline-flex items-center cursor-pointer mt-2">
                        <input
                          type="checkbox"
                          checked={student.attenDance?.status || false} 
                          className="sr-only peer"
                          onChange={(e) => handleAttendance(student.id, e.target.checked)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div id="toast" className="toast">
        {toastMessage}
      </div>
    </main>
  );
};

export default AttenDance;
