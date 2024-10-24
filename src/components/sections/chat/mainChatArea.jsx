import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import ScrollToBottom from 'react-scroll-to-bottom'; 
import { api } from '@/utils/axios';

const MainChatArea = ({ selectedUserId, setOnlineUsers, onlineUsers }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const connection = useRef(null);
    const senderAppUserId = useRef(null); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        senderAppUserId.current = decodedToken.nameid; 

        const fetchMessages = async () => {
            try {
                const response = await api().get('/Chat', {
                    params: {
                        senderAppUserId: senderAppUserId.current,
                        ReceiverAppUserId: selectedUserId,
                    },
                    headers: {
                        'accept': '*/*'
                    }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            }
        };

        if (selectedUserId) {
            fetchMessages();
        }
    }, [selectedUserId]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        connection.current = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5180/chathub', {
                accessTokenFactory: () => token,
                withCredentials: true
            })
            .configureLogging(signalR.LogLevel.Error)
            .withAutomaticReconnect()
            .build();

        connection.current.start()
            .then(() => {
                connection.current.on('ReceiveMessage', (senderId, receivedMessage) => {
                    if (senderId !== selectedUserId) return;
                    setMessages(prevMessages => [
                        ...prevMessages, 
                        { senderAppUserId: senderId, message: receivedMessage }
                    ]);
                });

                connection.current.on('UserConnected', (userId) => {
                    setOnlineUsers(prev => [...prev, userId]);
                });

                connection.current.on('UserDisconnected', (userId) => {
                    setOnlineUsers(prev => prev.filter(id => id !== userId));
                });
            })
            .catch(err => console.error('SignalR Connection Error:', err));

        return () => {
            if (connection.current) {
                connection.current.off('ReceiveMessage');
                connection.current.stop();
            }
        };
    }, [selectedUserId, setOnlineUsers]);

    const sendMessage = async () => {
        if (message.trim() !== '' && selectedUserId) {
            try {
                await connection.current.invoke('SendMessageToUser', selectedUserId, message);
                setMessages(prevMessages => [
                    ...prevMessages, 
                    { senderAppUserId: senderAppUserId.current, message }
                ]);
                setMessage('');
            } catch (err) {
                console.error('Error sending message:', err);
            }
        }
    };

    return (
        <>
            <ScrollToBottom  className=" flex-1 overflow-y-auto p-4  ">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-4 ${msg.senderAppUserId === senderAppUserId.current ? 'justify-end' : ''}`}>
                        {msg.senderAppUserId === senderAppUserId.current ? (
                                 <>
                                 <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                                     <p className='text-white'>{msg.message}</p>
                                 </div>
                                 <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                     <img src="https://placehold.co/200x/73be48/ffffff.svg?text=ME&font=Lato" alt="My Avatar" className="w-8 h-8 rounded-full" />
                                 </div>
                             </>
                        ) : (
                            <>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                                <img src="https://placehold.co/200x/ed145b/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" className="w-8 h-8 rounded-full" />
                            </div>
                            <div className="flex max-w-96 bg-[#e1ffc7] rounded-lg p-3 gap-3">
                                <p>{msg.message}</p>
                            </div>
                        </>
                        )}
                    </div>
                ))}
            </ScrollToBottom>

            {selectedUserId && (
                <footer className="bg-white border-t border-gray-300 p-4">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyPress={e => {
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
            )}
        </>
    );
};

export default MainChatArea;
