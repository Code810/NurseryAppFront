import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SectionName from '@/components/ui/sectionName';
import Title from '@/components/ui/title';
import Card from './card';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getBlogs = async () => {
          try {
            const response = await axios.get('http://localhost:5180/api/Blog?count=3'); 
            setBlogs(response.data);
          } catch (err) {
            setError(err.message);
          }
        };
        getBlogs();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    return (
        <section className="lg:pt-15 lg:pb-15 pt-10 pb-10">
            <div className="container">
                <div className="flex flex-col justify-center items-center">
                    <SectionName>Bizim Xəbərlər</SectionName>
                    <Title size={"3.5xl"} className={"mt-2.5 text-center lg:max-w-[470px]"}>
                        Uşaq Bağçamızda Yeniliklər və Tədbirlər – Ən Son Xəbərlər
                    </Title>
                </div>
                <div className="lg:pt-15 pt-10">
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-7.5">
                        {error && <p>Error loading blogs: {error}</p>}
                        {blogs.length > 0 ? (
                            blogs.map(({ id, title, desc, fileName, createdDate }) => (
                                <Card 
                                    key={id} 
                                    id={id} 
                                    src={fileName} 
                                    title={title} 
                                    blog_desc={desc} 
                                    date={formatDate(createdDate)} // Pass the formatted date
                                />
                            ))
                        ) : (
                            <p>Loading blogs...</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blogs;
