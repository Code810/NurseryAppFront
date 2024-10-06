import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import ProfileMenu from '@/components/profileMenu/profileMenu';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { getParentEndpoint, getTeacherDetailEndpoint } from '@/api';

const RootProfile = () => {
  const [decodeToken, setDecodeToken] = useState({});
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authToken, setAuthToken] = useState(null);


  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      const decoded = jwtDecode(token);
      setDecodeToken(decoded);

      const roles = decoded.role; 
      const appUserId = decoded.nameid;

      if (roles && appUserId) {
        roles.forEach(role => {
          let url = '';

          if (role === 'parent') {
            url =getParentEndpoint(appUserId);
            setUserRole(role);

          } else if (role === 'teacher') {
            url = getTeacherDetailEndpoint(appUserId);
            setUserRole(role);
          }

          if (url) {
            axios
              .get(url)
              .then(response => {
                setUserData(response.data);
              })
              .catch(error => {
                console.error(`Error fetching data for role ${role}:`, error);
              });
          }
        });
      }
    }
  }, []);

  
  return (
    <div className="min-h-screen bg-gray-50 text-slate-500 flex flex-col md:flex-row">
      <ProfileMenu decodeToken={decodeToken} userRole={userRole}/>
      <Outlet context={{  userData, userRole, authToken }} />
    </div>
  );
};

export default RootProfile;
