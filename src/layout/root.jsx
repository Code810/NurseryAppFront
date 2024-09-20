import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/sections/headers/header'
import Footer from '@/components/sections/footers/footer'

const RootLayout = () => {

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default RootLayout