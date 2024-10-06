import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; 
import { FaCalendarDays, FaComments, FaUser } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import SlideUp from '@/lib/animations/slideUp';
import { MdModeEdit, MdDelete } from "react-icons/md";
import { getBlogDetailEndpoint, postCommentEndpoint, deleteCommentEndpoint, updateCommentEndpoint } from '@/api'; // Assuming these endpoints are defined

const BlogArticle = () => {
  const { id } = useParams(); 
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setTokenData(decodedToken);
    }
  }, []);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(getBlogDetailEndpoint(id));
      setBlog(response.data);
      setLoading(false);
    } catch (err) {
      setError('An error occurred while fetching the blog.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlog(); 
    }
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        postCommentEndpoint(),
        {
          message: newComment,
          blogId: id,
          appUserId: tokenData?.nameid, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
       
        setBlog((prevBlog) => ({
          ...prevBlog,
          comments: [...prevBlog.comments, response.data],
        }));
        setNewComment('');
        setCommentsVisible(true); 
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(deleteCommentEndpoint(commentId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: prevBlog.comments.filter((comment) => comment.id !== commentId),
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditCommentId(comment.id);
    setEditCommentValue(comment.message);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        updateCommentEndpoint(editCommentId),
        {
          message: editCommentValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: prevBlog.comments.map((comment) =>
          comment.id === editCommentId ? { ...comment, message: editCommentValue } : comment
        ),
      }));
      setEditCommentId(null);
      setEditCommentValue('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const paginateComments = () => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    return blog.comments.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(blog?.comments.length / commentsPerPage);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <SlideUp delay={2}>
        <img src={blog.fileName} alt="blog-details" className="w-[100%]" />
        <div className="pt-7.5">
          <h4 className="lg:text-[32px] md:text-[28px] text-xl lg:leading-[130%] md:leading-[120%] leading-[110%] font-bold pb-5">
            {blog.title}
          </h4>
          <p>{blog.desc}</p>
          <ul className="flex gap-7.5 pb-5 flex-wrap my-5">
            <li className="flex items-center ">
              <FaCalendarDays className="text-foreground" />
              <span className="text-[#686868] ml-2.5">
                {new Date(blog.createdDate).toDateString()}
              </span>
            </li>
            <li className="flex items-center">
              <FaUser className="text-foreground" />
              <span className="text-[#686868] ml-2.5">By {blog.appUserUserName}</span>
            </li>
            <li className="flex items-center">
              <FaComments className="text-foreground" />
              <button
                onClick={() => setCommentsVisible(!commentsVisible)}
                className="text-[#686868] ml-2.5"
              >
                Comments ({blog.comments.length})
              </button>
            </li>
          </ul>
        </div>
      </SlideUp>

      {commentsVisible && (
        <div className="mt-5">
          {paginateComments().map((comment) => (
            <div key={comment.id} className="border-b rounded-xl border-gray-300 pb-4 mb-2 bg-[#fff8f2] p-5">
              {editCommentId === comment.id ? (
                <form onSubmit={handleUpdateComment} className="mt-4">
                  <textarea
                    className="w-full rounded-[10px] border-2 px-5 py-[15px] outline-none"
                    value={editCommentValue}
                    onChange={(e) => setEditCommentValue(e.target.value)}
                  ></textarea>
                  <Button variant="secondary" type="submit" className="mt-2">
                    Update Comment
                  </Button>
                  <Button
                    variant="destructive"
                    type="button"
                    className="ml-2 text-white"
                    onClick={() => setEditCommentId(null)}
                  >
                    Cancel
                  </Button>
                </form>
              ) : (
                <>
                  <div className='flex justify-between px-4'>
                    <div>
                      <p>
                        <strong>{comment.appUserUserName}:</strong> {comment.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdDate).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      {tokenData?.unique_name === comment.appUserUserName && (
                        <div>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500"
                          >
                            <MdDelete />
                          </button>
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-blue-500 ml-3"
                          >
                            <MdModeEdit />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
            >
              Previous
            </Button>
            <Button
             variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {tokenData && (
        <div className="pt-10">
          <h3 className="text-[28px] font-bold leading-[148%] font-nunito">Write your comment</h3>
          <form onSubmit={handleCommentSubmit} className="mt-7">
            <div className="pt-7.5">
              <textarea
                name="message"
                id="message"
                placeholder="Write your Message here"
                className="w-full min-h-36 rounded-[10px] border-2 text-[#686868] placeholder-[#686868] border-[#F2F2F2] px-5 py-[15px] outline-none"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
            </div>
            <Button
              type="submit"
              variant="pill"
              className="bg-primary border-primary hover:text-primary-foreground lg:mt-10 mt-5 lg:max-w-[186px] max-w-[140px] w-full"
            >
              Send Now
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BlogArticle;
