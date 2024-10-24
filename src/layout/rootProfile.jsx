import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import ProfileMenu from '@/components/profileMenu/profileMenu';
import { jwtDecode } from 'jwt-decode';
import { api } from '@/utils/axios';

const RootProfile = () => {
  const [decodeToken, setDecodeToken] = useState({});
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      const decoded = jwtDecode(token);
      setDecodeToken(decoded);

      const roles = decoded.role;
      const appUserId = decoded.nameid;

      if (roles && appUserId) {
        if (roles.includes('parent')) {
          setUrl(`/Parent/${appUserId}`);
          setUserRole('parent');
        } else if (roles.includes('teacher')) {
          setUrl(`/teacher/${appUserId}`);
          setUserRole('teacher');
        } else if (roles.includes('admin')) {
          setUserRole('admin');
        } else {
          setUserRole('member');
        }
      }
    }
  }, []);

  useEffect(() => {
    if (url) {
      api()
        .get(url)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
        });
    }
  }, [url]);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-500 flex flex-col md:flex-row">
    <ProfileMenu decodeToken={decodeToken} userRole={userRole} userData={userData} />
    <Outlet context={{ userData, userRole, authToken }} />
  </div>
  );
};

export default RootProfile;
