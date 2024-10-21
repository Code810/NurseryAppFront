import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { api } from '@/utils/axios';

const Register = () => {
    
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [includeParent, setIncludeParent] = useState(false); 
    const [adress, setAdress] = useState('');
    const [relationToStudent, setRelationToStudent] = useState('Ata'); 
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const form = useRef();

    const sendEmail = (recipientEmail, confirmationLink) => {
        const emailParams = {
            user_email: recipientEmail,
            confirmation_link: confirmationLink,
        };

        emailjs.send(
            'service_ghf678b',         
            'template_awddwtf',         
            emailParams,
            '6I45DkBAhOJuG-kDd'           
        )
        .then((result) => {
        }, (error) => {
        });
    };
   

 
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            
            const registerRequest = {
                registerDto: {
                    firstName,
                    lastName,
                    userName,
                    email,
                    password,
                },
                parentCreateDto: includeParent ? {
                    adress,
                    relationToStudent,
                } : null,
            };

          
            const response = await api().post(`/Auth/register`, registerRequest);

           
            if (response.status === 200 || response.status === 201) {
                const { email, token } = response.data;
                const confirmationLink = `${window.location.origin}/ConfirmEmail?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
                sendEmail(email, confirmationLink);
                setErrorMessage('');
                navigate('/login');
            }
        } catch (error) {
           
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else if (error.response && error.response.data && typeof error.response.data === 'string') {
                setErrorMessage(error.response.data); 
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-700">Göyqurşağı bağçası</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Zəhmət olmasa məlumatlarınızı daxil edin.
                    </p>
                </div>
                <form onSubmit={handleRegister} className="space-y-6">
                    
                    <div className="space-y-1">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            Adınız
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="adınızı daxil edin"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Soyadınız
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Soyadınızı daxil edin"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                            İstifadəçi adı
                        </label>
                        <input
                            id="userName"
                            name="userName"
                            type="text"
                            required
                            className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="İstifadəçi adını daxil edin"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Emailinizi daxil edin"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Şifrə
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className={`w-full px-3 py-2 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="şifrəni daxil edin"
                        />
                    </div>

                  
                    <div className="space-y-1">
                        <label htmlFor="includeParent" className="flex items-center">
                            <input
                                id="includeParent"
                                name="includeParent"
                                type="checkbox"
                                checked={includeParent}
                                onChange={() => setIncludeParent((prev) => !prev)}
                                className="mr-2"
                            />
                            Əgər valideynsinizsə işarəni aktiv edin                        </label>
                    </div>

                  
                    {includeParent && (
                        <>
                            <div className="space-y-1">
                                <label htmlFor="adress" className="block text-sm font-medium text-gray-700">
                                    Ünvan
                                </label>
                                <input
                                    id="adress"
                                    name="adress"
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    value={adress}
                                    onChange={(e) => setAdress(e.target.value)}
                                    placeholder="Ünvanınızı daxil edin"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="relationToStudent" className="block text-sm font-medium text-gray-700">
                                    Valideyn
                                </label>
                                <select
                                    id="relationToStudent"
                                    name="relationToStudent"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    value={relationToStudent}
                                    onChange={(e) => {
                                       
                                        setRelationToStudent(e.target.value);
                                    }}
                                >
                                    <optgroup label="Valideyn">
                                        <option value="Ata">Ata</option>
                                        <option value="Ana">Ana</option>
                                        <option value="Nənə">Nənə</option>
                                        <option value="Baba">Baba</option>
                                    </optgroup>
                                </select>


                            </div>
                        </>
                    )}

                   
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                   
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-[#ed145b] rounded-lg shadow-md hover:bg-[#d90047] focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
                        >
                            Qeydiyyat
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Qeydiyyatınız var? <a href="/login" className="font-medium text-pink-500">Daxil ol</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
