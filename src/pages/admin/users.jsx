import React, { useState, useEffect } from 'react';
import TableUsers from '@/components/admin/tableUser';
import { api } from '@/utils/axios';
import { Button } from '@/components/ui/button';

function UsersPage() {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);

  const fetchUsers = async (text = '') => {
    try {
      const response = await api().get(`AppUser`, {
        params: { searchText: text }, 
      });
      setUsers(response.data); 
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchUsers(searchText); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-4 relative">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className="border p-2 rounded-md w-full"
        />
      <div className=''>
      <Button
          variant="outline"
          className="absolute end-[30px] h-[35px] mt-1"
        >
          Axtar
        </Button>
      </div>
      </form>

      <TableUsers users={users} setUsers={setUsers}/>
    </div>
  );
}

export default UsersPage;
