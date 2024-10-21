import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '@/utils/axios'; 

const HomeWorksAdmin = () => {
  const { state } = useLocation();
  const group = state?.group || {}; 
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (group.id) {
      fetchHomeworks(group.id);
    }
  }, [group.id]);

  const fetchHomeworks = async (groupId) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await api().get(`/HomeWork`, {
        params: {
          groupId: groupId,
        },
      });
      setHomeworks(response.data);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Bu qrup üçün tapşırıq tapılmadı');
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading homework details...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Homeworks for {group.name}</h1>
      {homeworks.length > 0 ? (
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {homeworks.map((homework) => (
              <tr key={homework.id} className="border-t text-center">
                <td className="px-4 py-4 text-sm text-gray-700">{homework.title}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{homework.description}</td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {new Date(homework.dueDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {new Date(homework.createdDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No homeworks found for this group.</p>
      )}
    </div>
  );
};

export default HomeWorksAdmin;
