
import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/about/pageTitle';
import Pagination from '@/components/ui/pagination';
import GroupCard from '@/components/sections/Groups/GroupCard';
import { api } from '@/utils/axios';

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [totalGroups, setTotalGroups] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const pageSize = 9;

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api().get(`/Group/all?text=${search}&page=${currentPage}`);
        const groupsData = response.data?.items || [];
        const totalCount = response.data?.totalCount || 0;

        setGroups(groupsData);
        setTotalGroups(totalCount);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Not Found');
          setGroups([]);
          setTotalGroups(0);
        } else {
          setError('An error occurred while fetching groups.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [currentPage, search]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalGroups / pageSize)) {
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

  const totalPages = Math.ceil(totalGroups / pageSize);

  return (
    <>
      <main>
        <PageTitle pageName={"Qruplar"} />
        <div className="lg:pt-15 pt-10">
          <div className="container">
            <div className="flex lg:gap-[20px] gap-6 flex-wrap justify-center">
              <input
                onKeyUp={handleSearch}
                type="text"
                name="search"
                id="search"
                placeholder="Search here"
                className="w-full h-10 border border-gray-400 px-10 rounded-md outline-none mx-5"
              />

              {error && <p className="text-red-500">{error}</p>}

              {loading ? (
                <p>Loading groups...</p>
              ) : (
                groups.length > 0 ? (
                  groups.map(({ price, id, name, maxAge, minAge, language }) => (
                    <GroupCard
                      key={id}
                      id={id}
                      name={name}
                      maxAge={maxAge}
                      price={price}
                      minAge={minAge}
                      language={language}
                    />
                  ))
                ) : (
                  <p>No groups found</p>
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



export default Group;
