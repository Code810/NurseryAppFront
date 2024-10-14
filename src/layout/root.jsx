import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/sections/headers/header'
import Footer from '@/components/sections/footers/footer'
import { api } from '@/utils/axios'

const RootLayout = () => {
    const [settings, setSettings] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const getSettings = async () => {
        try {
          const response = await api().get(`/Settings`); 
          setSettings(response.data);
        } catch (err) {
          setError(err.message);
        }
      };
      getSettings();
    }, []);

    return (
        <>
        <Header settings={settings} /> 
        <Outlet context={{ settings }}/>
        <Footer settings={settings} /> 
      </>
    )
}

export default RootLayout