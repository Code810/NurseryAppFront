import React from 'react';
import { useParams } from 'react-router-dom';
import PageTitle from '@/components/about/pageTitle';
import BlogArticle from '@/components/sections/blogs/blogArticle';

const BlogDetails = () => {
  const { id } = useParams(); // Get the 'id' from the URL

  return (
    <>
      <main>
        <PageTitle pageName={"Xəbər"} />
        <div className='pt-15'>
          <div className='container'>
            <div className='grid xl:grid-cols-[850px_auto] lg:grid-cols-[670px_auto] grid-cols-1 gap-7.5 justify-center'>
              <BlogArticle id={id} /> {/* Pass the 'id' as a prop */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogDetails;
