import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@/components/sections/blogs/card';
import PageTitle from '@/components/about/pageTitle';
import { getBlogsSearch } from '@/api';
import Pagination from '@/components/ui/pagination';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const pageSize = 9;

  useEffect(() => {
    const getBlogsAll = async () => {
      setLoading(true); 
      setError(null);  
      try {
        const response = await axios.get(getBlogsSearch(search, currentPage)); 
        const blogsData = response.data?.items || [];
        const totalCount = response.data?.totalCount || 0;

        setBlogs(blogsData);
        setTotalBlogs(totalCount);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Not Found');  
          setBlogs([]);           
          setTotalBlogs(0);       
        } else {
          setError('An error occurred while fetching blogs.');
        }
      } finally {
        setLoading(false); 
      }
    };
    getBlogsAll();
  }, [currentPage, search]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalBlogs / pageSize)) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearch(e.target.value); 
      setCurrentPage(1); 
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const totalPages = Math.ceil(totalBlogs / pageSize);

  return (
    <>
      <main>
        <PageTitle pageName={"Xəbərlər"} />
        <div className="lg:pt-15 pt-10">
          <div className="container">
            <div className="flex lg:gap-[60px] gap-10 flex-wrap ">
           
              <input
                onKeyUp={handleSearch} 
                type="text"
                name="search"
                id="search"
                placeholder="Search here"
                className="w-full h-10 border border-gray-400 px-10 rounded-md outline-none mx-5"
              />

              {error && <p>{error}</p>}
              
              {loading ? (
                <p>Loading blogs...</p>
              ) : (
                blogs && blogs.length > 0 ? ( 
                  blogs.map(({ id, title, desc, fileName, createdDate }) => (
                    <Card
                      key={id}
                      id={id}
                      src={fileName}
                      title={title}
                      blog_desc={desc}
                      date={formatDate(createdDate)}
                    />
                  ))
                ) : !error && ( 
                  <p>No blogs found</p>
                )
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Blog;
