
import ThemeProvider from '@/utils/ThemeContext'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './adminHeader/adminHeader';
import Sidebar from './adminSideBar/adminSideBar';

const AdminRoot = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
         <ThemeProvider>
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex ">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Outlet />
        </div>
        </ThemeProvider>
        </>
      
    )
}

export default AdminRoot
