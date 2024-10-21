import React from 'react';
import { useLocation } from 'react-router-dom';
import {  FaUser, FaComments } from 'react-icons/fa';
import { FaRegCalendarDays } from 'react-icons/fa6';

const BlogDetail = () => {
  const location = useLocation();
  const { blog } = location.state || {}; 

  return (
    <div className="container mx-auto p-8">
      {blog ? (
        <div>
          <img src={blog.fileName} alt="blog-details" className="" />
          <div className="pt-7.5">
            <h4 className="text-xl font-bold pb-5">{blog.title}</h4>
            <p>{blog.desc}</p>
            <ul className="flex gap-7.5 pb-5 flex-wrap my-5">
              <li className="flex items-center">
                <FaRegCalendarDays className="text-foreground" />
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
                <span className="text-[#686868] ml-2.5">Comments ({blog.comments.length})</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <p>No blog data available</p>
      )}
    </div>
  );
};

export default BlogDetail;
