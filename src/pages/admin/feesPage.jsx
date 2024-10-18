import React, { useState, useEffect } from 'react';
import { api } from '@/utils/axios'; // Adjust according to your axios setup

const FeesPage = () => {
  const [fees, setFees] = useState([]);
  const [date, setDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch fees data from the server
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

  useEffect(() => {
    fetchFees(); // Fetch all fees on component mount
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFees(date, searchText); // Fetch fees based on the search input and date
  };

  return (
    <div className="container mx-auto p-4">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Fees</h2>
      </header>

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
        <button
          type="submit"
          className="px-3 py-2 bg-blue-500 text-white rounded-lg"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading fees...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && fees.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Student Name</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Paid Date</th>
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
    </div>
  );
};

export default FeesPage;
