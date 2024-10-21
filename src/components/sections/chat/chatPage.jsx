import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

const ChatPage = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5180/api/AppUser?searchText=');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();

        const token = localStorage.getItem('token');

        const connect = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5180/chathub', {
                accessTokenFactory: () => token,
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .build();

        connect.start()
            .then(() => {
                console.log('Connected to SignalR');
                connect.on('ReceiveMessage', (receivedMessage) => {
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    scrollToBottom();
                });
            })
            .catch(err => console.error('SignalR Connection Error: ', err));

        setConnection(connect);

        return () => {
            if (connection) connection.stop();
        };
    }, []);

    const sendMessage = async () => {
        if (message.trim() !== '' && selectedUserId) {
            try {
                await connection.invoke('SendMessageToUser', selectedUserId, message);
                setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
                setMessage('');
                scrollToBottom();
            } catch (err) {
                console.error('Error sending message: ', err);
            }
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 bg-white border-r border-gray-300">
                <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
                    <h1 className="text-2xl font-semibold">Chat Web</h1>
                </header>

                <div className="overflow-y-auto h-full p-3">
                    {users.map(user => (
                        <div
                            key={user.id}
                            className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                            onClick={() => setSelectedUserId(user.id)}
                        >
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                <img src={`https://placehold.co/200x${user.avatarColor}/ffffff.svg?text=${user.initials}&font=Lato`} alt="User Avatar" className="w-12 h-12 rounded-full" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
                                <p className="">{user.userName} </p>
                                <p className="text-gray-600">Click to chat</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white p-4 text-gray-700">
                    <h1 className="text-2xl font-semibold">{users.find(u => u.id === selectedUserId)?.firstName || 'Select a user'}</h1>
                </header>

                {/* Chat Messages */}
                <div className="flex-1 h-0 overflow-y-auto p-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex mb-4 ${msg.startsWith('You:') ? 'justify-end' : ''}`}>
                            {msg.startsWith('You:') ? (
                                <>
                                    <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                                        <p>{msg.replace('You: ', '')}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                        <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ME&font=Lato" alt="My Avatar" className="w-8 h-8 rounded-full" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                                        <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" className="w-8 h-8 rounded-full" />
                                    </div>
                                    <div className="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                                        <p>{msg}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>

                {/* Chat Input */}
                <footer className="bg-white border-t border-gray-300 p-4">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
                        >
                            Send
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ChatPage;
