import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; 
import { api } from '@/utils/axios';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    file: null,
  });

  const navigate = useNavigate(); 

  const fetchBlogs = async (text = '', page = 1) => {
    try {
      const response = await api().get('/Blog/all', {
        params: { text, page },
      });
      setBlogs(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchBlogs(searchText, currentPage);
  }, [searchText, currentPage]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetail = (blog) => {
    navigate('/admin/blogDetail', { state: { blog } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateBlog = () => {
    setIsModalOpen(true);
    setSelectedBlog(null);
    setFormData({ title: '', desc: '', file: null });
  };

  const handleEditBlog = (blog) => {
    setIsModalOpen(true);
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      desc: blog.desc,
      file: null,
    });
  };

  const handleDeleteBlog = async (blogId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api().delete(`/Blog/${blogId}`);
          setBlogs(blogs.filter((blog) => blog.id !== blogId));
          Swal.fire('Deleted!', 'Your blog has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'There was a problem deleting the blog.', 'error');
        }
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const getAppUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.nameid;
    }
    return null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const appUserId = getAppUserIdFromToken();

    if (!appUserId) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('Title', formData.title);
    formDataToSend.append('Desc', formData.desc);
    formDataToSend.append('File', formData.file);

    try {
      if (selectedBlog) {
        await api().put(`/Blog/${selectedBlog.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setBlogs(blogs.map((blog) => (blog.id === selectedBlog.id ? { ...blog, ...formData } : blog)));
      } else {
        await api().post(`/Blog?AppUserId=${appUserId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        fetchBlogs();
      }
      setIsModalOpen(false);
    } catch (error) {
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Xəbərlər</h2>
          <Button variant="pill" onClick={handleCreateBlog}>
            Xəbər yaratmaq
          </Button>
        </div>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search blogs..."
          className="mt-2 px-3 py-1 border rounded-lg w-full"
        />
      </header>

      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap text-left text-[#ed145b]">Şəkil</th>
                <th className="p-2 whitespace-nowrap text-left text-[#ed145b]">Başlıq</th>
                <th className="p-2 whitespace-nowrap text-left text-[#ed145b]">Yaranma tarixi</th>
                <th className="p-2 whitespace-nowrap text-center text-[#ed145b]">Əlavələr</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="p-2">
                    <img src={blog.fileName} alt={blog.title} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="p-2">{blog.title}</td>
                  <td className="p-2">{new Date(blog.createdDate).toLocaleDateString()}</td>
                  <td className="p-2 ">
                    <div className="flex justify-center space-x-2 items-center ">
                      <FaEye className="inline-block cursor-pointer" onClick={() => handleViewDetail(blog)} />
                      <FaEdit
                        className="inline-block text-blue-500 cursor-pointer"
                        onClick={() => handleEditBlog(blog)}
                      />
                      <FaTrash
                        className="inline-block text-red-500 cursor-pointer"
                        onClick={() => handleDeleteBlog(blog.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(totalCount / 10) }, (_, index) => (
          <button
            key={index + 1}
            className={`mx-1 px-3 py-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold">{selectedBlog ? 'Update Blog' : 'Create Blog'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">File</label>
            <input
              type="file"
              name="file"
              onChange={handleFormChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="text-center">
            <Button variant="secondary">{selectedBlog ? 'Update Blog' : 'Create Blog'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlogsPage;
