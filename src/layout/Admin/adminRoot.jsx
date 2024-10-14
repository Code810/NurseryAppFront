
import ThemeProvider from '@/utils/ThemeContext'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './adminHeader/adminHeader';
import Sidebar from './adminSideBar/adminSideBar';

const AdminRoot = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    console.log(sidebarOpen);
    return (
        <>
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex h-screen overflow-hidden">
            <ThemeProvider>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Outlet />
            </ThemeProvider>

        </div>
        </>
      
    )
}

export default AdminRoot