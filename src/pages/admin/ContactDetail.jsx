import { Button } from '@/components/ui/button';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ContactDetail = () => {
  const location = useLocation();
  const { message } = location.state || {};
  const navigate = useNavigate(); 

  if (!message) {
    return <div>No message data available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h1 className="text-2xl font-semibold">Müraciət ətraflı</h1>
      </header>
      <div className="bg-white p-4 rounded-md shadow-md mt-4">
        <h2 className="text-xl font-medium mb-2">Müraciət "{message.fullName}" tərəfindən göndərilib</h2>
        <p><strong>Email:</strong> {message.email}</p>
        <p><strong>Ünvan:</strong> {message.adress}</p>
        <p><strong>Müraciət:</strong></p>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md bg-blue-50"
          rows="5"
          value={message.message}
          readOnly
        ></textarea>
        <p className="mt-4"><strong>Göndərilmə tarixi:</strong> {new Date(message.createdDate).toLocaleString()}</p>
       
        <Button
          className="mt-4"
          variant="ghost"
          onClick={() => navigate('/admin/contacts')}
        >
          Geri
        </Button>
      </div>
    </div>
  );
};

export default ContactDetail;
