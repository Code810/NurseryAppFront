import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { api } from '@/utils/axios';

const ContactInbox = () => {
  const [contactMessages, setContactMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchMessages = () => {
    api().get(`Contact/all?text=${searchText}&page=${page}`, {
        headers: {
          accept: '*/*',
        },
      })
      .then((response) => {
        setContactMessages(response.data.items);
        setTotalPages(Math.ceil(response.data.totalCount / 10)); 
      })
      .catch((error) => {
      });
  };

  useEffect(() => {
    fetchMessages();
  }, [page, searchText]);

  const truncateMessage = (message) => {
    return message.length > 25 ? message.substring(0, 25) + '...' : message;
  };

  const formatDate = (createdDate) => {
    const date = new Date(createdDate);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: 'long' });
    }
  };

  const handleDelete = () => {
    api().delete('/Contact/bulk-delete', {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        data: selectedMessages,
      })
      .then(() => {
        setContactMessages((prevMessages) =>
          prevMessages.filter((msg) => !selectedMessages.includes(msg.id))
        );
        setSelectedMessages([]);
      })
      .catch((error) => {
      });
  };

  const handleRowClick = (message) => {
    if (!message.isRead) {
      api().put(`/Contact/${message.id}`, null, {
          headers: {
            accept: '*/*',
          },
        })
        .then(() => {
          navigate(`/admin/contactdetail`, { state: { message: { ...message, isRead: true } } });
        })
        .catch((error) => {
        });
    } else {
      navigate(`/admin/contactdetail`, { state: { message } });
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedMessages.includes(id)) {
      setSelectedMessages(selectedMessages.filter((msgId) => msgId !== id));
    } else {
      setSelectedMessages([...selectedMessages, id]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h1 className="text-2xl font-semibold">Müraciətlər</h1>
      </header>

      <div className="mb-4 px-5">
        <input
          type="text"
          placeholder="Axtar..."
          className="border p-2 rounded-lg w-full "
          value={searchText}
          onChange={handleSearchChange}
        />
       <div className='h-[10px]'>
       <MdDelete
          style={{ display: selectedMessages.length > 0 ? 'block' : 'none' }}
          className="cursor-pointer text-[20px] mt-3 mx-4"
          onClick={handleDelete}
        />
       </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md mt-4">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-6 py-2 font-medium text-[#ed145b]">Select</th>
              <th className="px-6 py-2 font-medium text-[#ed145b]">Full Name</th>
              <th className="px-6 py-2 font-medium text-[#ed145b]">Message</th>
              <th className="px-6 py-2 font-medium text-[#ed145b]">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {contactMessages.length > 0 ? (
              contactMessages.map((message) => (
                <tr
                  key={message.id}
                  className={`border-t border-gray-200 cursor-pointer ${
                    selectedMessages.includes(message.id) ? 'bg-blue-100' : ''
                  }  ${!message.isRead ? 'bg-[#fbf4f6] font-bold' : ''}`}
                >
                  <td className="px-6 py-3">
                    <input
                      className="rounded-sm"
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => handleCheckboxChange(message.id)}
                    />
                  </td>
                  <td className="px-6 py-3" onClick={() => handleRowClick(message)}>
                    <span className={``}>{message.fullName}</span>
                  </td>
                  <td className="px-6 py-3 truncate max-w-md" onClick={() => handleRowClick(message)}>
                    {truncateMessage(message.message)}
                  </td>
                  <td className="px-6 py-3" onClick={() => handleRowClick(message)}>
                    {formatDate(message.createdDate)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  No contact messages available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 px-5">
        <button
          className="px-4 py-2 bg-[#ed145b] text-white rounded"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Əvvəlki
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-[#ed145b]  text-white rounded"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Növbəti
        </button>
      </div>
    </div>
  );
};

export default ContactInbox;
