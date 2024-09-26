import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/sections/headers/header'
import Footer from '@/components/sections/footers/footer'
import { getSettingsEndpoint } from '@/api'
import axios from 'axios'

const RootLayout = () => {
    const [settings, setSettings] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const getSettings = async () => {
        try {
          const response = await axios.get(getSettingsEndpoint()); 
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