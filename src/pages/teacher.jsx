import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/about/pageTitle';
import Pagination from '@/components/ui/pagination';
import TeacherCard from '@/components/sections/Teachers/TeacherCard';
import { api } from '@/utils/axios';

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const pageSize = 9;

  useEffect(() => {
    const getTeachersAll = async () => {
      setLoading(true); 
      setError(null);  
      try {
        const response = await api().get(`/Teacher/all?text=${search}&page=${currentPage}`); 
        const teachersData = response.data?.items || [];
        const totalCount = response.data?.totalCount || 0;

        setTeachers(teachersData);
        setTotalTeachers(totalCount);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Not Found any Teacher');  
          setTeachers([]);           
          setTotalTeachers(0);       
        } else {
          setError('An error occurred while fetching blogs.');
        }
      } finally {
        setLoading(false); 
      }
    };
    getTeachersAll();
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

  const totalPages = Math.ceil(totalTeachers / pageSize);

  return (
    <>
      <main>
        <PageTitle pageName={"Müəllimlər"} />
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
                <p>Loading Teachers...</p>
              ) : (
                teachers && teachers.length > 0 ? ( 
                    teachers.map(({ id, firstName, lastName, fileName,facebook,twitter,linkedin,instagram}) => (
                        <TeacherCard key={id} id={id} firstName={firstName} lastName={lastName} fileName={fileName} 
                        facebook={facebook} twitter={twitter} linkedin={linkedin} instagram={instagram}
                        />
                      ))
                ) : !error && ( 
                  <p>Not found any Teacher</p>
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

export default Teacher;
