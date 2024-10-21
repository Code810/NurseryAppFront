import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { api } from '@/utils/axios';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [selectedSetting, setSelectedSetting] = useState(null); 
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedValue, setUpdatedValue] = useState(''); 
  const [file, setFile] = useState(null); 

  useEffect(() => {
    api().get('/Settings', {
        headers: {
          accept: '*/*',
        },
      })
      .then((response) => {
        setSettings(response.data);
      })
      .catch((error) => {
      });
  }, []);


  const handleEdit = (setting) => {
    setSelectedSetting(setting);
    setUpdatedValue(setting.value); 
    setModalOpen(true); 
  };


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const handleSubmit = () => {
    const formData = new FormData();

    if (isImage(selectedSetting.value)) {

      formData.append('Value', ''); 
      formData.append('File', file); 
    } else {

      formData.append('Value', updatedValue); 
      formData.append('File', ''); 
    }

    api().put(`Settings/${selectedSetting.id}`, formData, {
        headers: {
          accept: '*/*',
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const updatedSetting = response.data; 

        setSettings((prevSettings) =>
          prevSettings.map((setting) =>
            setting.id === selectedSetting.id
              ? {
                  ...setting,
                  value: updatedSetting.value || URL.createObjectURL(file),
                } 
              : setting
          )
        );
        setModalOpen(false); 
        setFile(null); 
      })
      .catch((error) => {
      });
  };

  const isImage = (value) => {
    return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(value);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h1 className="text-2xl font-semibold">Əlavələr</h1>
      </header>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-6 py-2 font-medium text-[#ed145b]">Adı</th>
              <th className="px-6 py-2 font-medium text-[#ed145b]">dəyəri</th>
              <th className="px-6 py-2 font-medium text-[#ed145b]"></th>
            </tr>
          </thead>
          <tbody>
            {settings.length > 0 ? (
              settings.map((setting) => (
                <tr key={setting.id} className="border-t border-gray-200">
                  <td className="px-6 py-3">{setting.key}</td>
                  <td className="px-6 py-3">
                    {isImage(setting.value) ? (
                      <img src={setting.value} alt={setting.key} className="h-16" />
                    ) : (
                      <span>{setting.value}</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      className="mr-3 text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(setting)}
                    >
                      <FaEdit />
                    </button>
                   
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center">
                  No settings available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Update Setting</h2>
            <label className="block text-sm mb-2">Key: {selectedSetting.key}</label>

            {isImage(selectedSetting.value) ? (
              <input
                type="file"
                accept="image/*"
                className="w-full border p-2 rounded"
                onChange={handleFileChange}
              />
            ) : (
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            )}

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
