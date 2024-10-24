import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '@/utils/axios';
import MainChatArea from './MainChatArea';

const ChatPage = () => {
    const location = useLocation();
    const { groupId, userId } = location.state || {};
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]); 

    const fetchUsers = async (appUserId, groupId) => {
        try {
            const response = await api().get('/AppUser/userschat', {
                params: { appUserId, id: groupId }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        if (userId && groupId) {
            fetchUsers(userId, groupId);
        }
    }, [userId, groupId]);

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

    return (
        <div className="flex h-[450px] overflow-hidden w-[90%] m-auto rounded-xl">
            <div className="h-[400px] bg-white border-r border-gray-300">
                <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
                    <h1 className="text-2xl font-semibold">Çat</h1>
                </header>

               
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
                                <div className="m-1 mr-2 w-12 h-12 relative flex justify-center items-center rounded-full text-xl text-white uppercase" style={{ backgroundColor: color }}>
                                    {text}
                                    <span className={`absolute border bottom-1 right-1 w-3 h-3 rounded-full ${onlineStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </div>

                                <div className="flex-1 ml-3">
                                    <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
                                    <p>{user.userName}</p>
                                    <p className="text-gray-600">mesaj üçün kliklə</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <header className="bg-white p-4 text-gray-700">
                    <h1 className="text-2xl font-semibold">
                        {users.find(u => u.id === selectedUserId)?.firstName || 'istifadəçi seçin'}
                    </h1>
                </header>
                
                <MainChatArea 
                    selectedUserId={selectedUserId} 
                    setOnlineUsers={setOnlineUsers}
                    onlineUsers={onlineUsers} 
                />
            </div>
        </div>
    );
};

export default ChatPage;
