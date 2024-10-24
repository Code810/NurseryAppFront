import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/axios';
import { IoArrowBackOutline } from 'react-icons/io5';

const TeacherCreate = () => {
  const [formData, setFormData] = useState({
    appUserId: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    file: null,
  });

  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await api().get('AppUser/users-by-role?searchText=');
      const userOptions = response.data.map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName} (${user.email})`,
      }));
      setUsers(userOptions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, appUserId: selectedOption.value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]); // Clear previous errors

    const form = new FormData();
    form.append('File', formData.file);
    form.append('AppUserId', formData.appUserId);
    form.append('Instagram', formData.instagram);
    form.append('Facebook', formData.facebook);
    form.append('Twitter', formData.twitter);
    form.append('Linkedin', formData.linkedin);

    try {
      await api().post('/Teacher', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/teachers');
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        
        // If the error response has a message
        const errorMessages = data.message ? [data.message] : [];
        
        // Handle the case where the errors array has objects like {Field: "Error message"}
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach(errObj => {
            const fieldErrors = Object.values(errObj); // Get the error message from the object
            errorMessages.push(...fieldErrors); // Push all error messages
          });
        }

        setErrors(errorMessages);
      } else {
        setErrors(['An unexpected error occurred.']);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <Link to="/admin/teachers" className="flex items-center gap-1 text-[#ed145b]">
          <IoArrowBackOutline className="text-[20px]" /> Geri
        </Link>
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Create Teacher</h2>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="block font-bold mb-1">Select User</label>
          <Select
            options={users}
            onChange={handleSelectChange}
            placeholder="Search and select a user..."
            className="mb-2 border-0"
            required
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Instagram</label>
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Facebook</label>
          <input
            type="text"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Twitter</label>
          <input
            type="text"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-bold mb-1">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Upload Image</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {errors.length > 0 && (
          <div className="text-red-500 space-y-1">
            {errors.map((error, index) => (
              <p key={index} className="text-red-500">{error}</p>
            ))}
          </div>
        )}

        <Button variant="secondary" type="submit">Create Teacher</Button>
      </form>
    </div>
  );
};

export default TeacherCreate;
