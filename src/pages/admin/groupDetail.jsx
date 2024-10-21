import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import { api } from '@/utils/axios'; 

const GroupDetailPage = () => {
  const { state } = useLocation(); 
  const group = state?.group || {};
  const [students, setStudents] = useState([]);

  const fetchStudents = async (groupId) => {
    try {
      const response = await api().get(`/Student/teacher?groupId=${groupId}`);
      setStudents(response.data); 
    } catch (error) {
    }
  };

  useEffect(() => {
    if (group.id) {
      fetchStudents(group.id);
    }
  }, [group.id]);
  return (
    <div className="container mx-auto p-4">
      <h2 className="font-semibold text-2xl mb-4">{group.name} Group Details</h2>
      <p>
        <strong>Room Number:</strong> {group.roomNumber}
      </p>
      <p>
        <strong>Age Range:</strong> {group.minAge} - {group.maxAge}
      </p>
      <p>
        <strong>Language:</strong> {group.language}
      </p>
      <p>
        <strong>Teacher:</strong> {`${group.teacherFirstName} ${group.teacherLastName}`}
      </p>

      <h3 className="font-semibold text-xl mt-6 mb-4">Students</h3>
      <div className="overflow-x-auto mt-4">
        <table className="w-full my-0 align-middle text-dark border-neutral-200">
          <thead className="align-bottom">
            <tr className="font-semibold text-[0.95rem] text-secondary-dark">
              <th className="pb-3 text-start min-w-[110px]">Şəkil</th>
              <th className="pb-3 text-start min-w-[110px]">Ad və Soyad</th>
              <th className="pb-3 text-start min-w-[110px]">Doğum tarixi</th>
              <th className="pb-3 text-start min-w-[110px]">Cinsiyəti</th>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupDetailPage;
