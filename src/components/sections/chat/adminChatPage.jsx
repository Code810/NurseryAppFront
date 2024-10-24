import React, { useState, useEffect } from 'react';
import { api } from '@/utils/axios';
import MainChatArea from './mainChatArea';
import Modal from '@/components/ui/modal';
import { FaCircleInfo } from 'react-icons/fa6';

const AdminChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (searchText) => {
    try {
      const response = await api().get('/AppUser', {
        params: { searchText },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(''); 
  }, []);

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const getAvatarDetails = (roles) => {
    if (!roles) return { color: '#999999', text: 'U' };
    if (roles.includes('admin')) return { color: '#1c9ebb', text: 'A' };
    if (roles.includes('teacher')) return { color: '#73be48', text: 'T' };
    if (roles.includes('parent')) return { color: '#ed145b', text: 'V' };
    return { color: '#999999', text: 'U' };
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen  overflow-hidden w-[90%] m-auto pb-[100px] rounded-xl">
      <div className="h-full  bg-white border-r border-gray-300">
      

        <div className="overflow-y-auto h-full p-3">
          {users.map(user => {
            const { color, text } = getAvatarDetails(user.roles);
            const onlineStatus = isUserOnline(user.id);

            return (
              <div
                key={user.id}
                className={`flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md ${selectedUserId === user.id ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <div className="m-1 mr-2 w-12 h-12 relative flex justify-center items-center rounded-full bg-gray-500 text-xl text-white uppercase" style={{ backgroundColor: color }}>
                  {text}
                  <span className={`absolute border bottom-1 right-1 w-3 h-3 rounded-full ${onlineStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>

                <div className="w-48 flex justify-between items-center ml-3 relative">
                 <div>
                 <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
                 <p className='text-[15px]'>{user.userName}</p>
                 </div>
                  <button
                    onClick={() => openModal(user)} 
                    className="text-blue-500 underline right-0 absolute"
                  >
                  <FaCircleInfo />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 text-gray-700">
          <h1 className="text-2xl font-semibold">{users.find(u => u.id === selectedUserId)?.firstName || 'istifadəçi seçin'}</h1>
        </header>

        {/* Pass props to MainChatArea */}
        <MainChatArea 
          selectedUserId={selectedUserId} 
          setOnlineUsers={setOnlineUsers}
          onlineUsers={onlineUsers} 
        />
      </div>

      {/* Modal to display user details */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedUser && (
          <div>
            <h2 className="text-xl font-bold">User Details</h2>
            <p><b>Name:</b> {selectedUser.firstName} {selectedUser.lastName}</p>
            <p><b>Username:</b> {selectedUser.userName}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Roles:</b> {selectedUser.roles.join(', ')}</p>
            <p><b>Blocked:</b> {selectedUser.isBlocked ? 'Yes' : 'No'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminChatPage;
