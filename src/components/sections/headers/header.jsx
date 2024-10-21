import React, { useState, useEffect, useRef } from 'react';
import DesktopMenu from './desktopMenu';
import MobileMenu from './mobileMenu';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaRegUser } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import TopHeader from './topHeader';
import Logo from '@/components/ui/logo';
import StickyHeader from '@/components/ui/stickyHeader';
import {jwtDecode} from "jwt-decode";
import user from "@/assets/images/user.png";
import { RiAdminFill } from "react-icons/ri";

const Header = ({ settings }) => {
    const logoSetting = settings?.find(s => s.key === 'logo');

    const [isMobleMenuActive, setIsMobleMenuActive] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isProfileMenuActive, setIsProfileMenuActive] = useState(false);
    const [decodeToken, setDecodeToken] = useState({});
    const profileMenuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setIsAuthenticated(true);
                const decoded = jwtDecode(token);
                setDecodeToken(decoded);
            } catch (error) {
                handleLogout(); 
            }
        }

        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsProfileMenuActive(false); 
        navigate('/');
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuActive((prev) => !prev);
    };

    const renderLoginButtons = () => (
        <>
            <Button asChild variant="secondary" className="sm:flex hidden">
                <Link to={"/login"}> Daxil ol <FaRegUser /></Link>
            </Button>
            <Button asChild variant="ghost" className="sm:flex hidden">
                <Link to={"/register"}> Qeydiyyat <FaArrowRight /></Link>
            </Button>
        </>
    );

    const renderProfileMenu = () => (
        <>
 <div className="relative" ref={profileMenuRef}>
            <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 px-4 text-[#ed145b] font-extrabold border-[#ed145b] border-2 rounded-full"
            >
                <FaRegUser />
                <span>{decodeToken.given_name}</span>
            </button> 
            {isProfileMenuActive && (
                <div className="absolute right-0 mt-2 p-[20px] w-[250px] bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="flex">
                        <div className="w-9">
                            <img src={user} alt="User Profile" />
                        </div>
                        <div className="profiledata items-center flex">
                            <span className='block px-2 text-sm font-bold'>{decodeToken.given_name} {decodeToken.family_name}</span>
                        </div>
                    </div>
                    <hr className='my-2' />
                    <Link to="/profile" className="flex p-2 block text-sm text-gray-700 hover:bg-gray-100">
                        <FaRegUser /> <p className='px-2'>Profilim</p>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex w-full text-left block p-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <LuLogOut />
                        <p className='px-2'>Çıxış</p>
                    </button>
                </div>
            )}
        </div>

        {decodeToken.role && decodeToken.role.includes("admin") && (
            <Link to={"/admin"} className="text-[#73be48] font-extrabold">
                <RiAdminFill />
            </Link>
        )}
        </>
       
        
    );

    return (
        <StickyHeader>
            <header id="header" className="sticky top-0 transition-[top] duration-300 z-40">
                <div id="header-container">
                    <TopHeader settings={settings} />
                    <div className="[.header-pinned_&]:shadow-md bg-background transition-all duration-300">
                        <div className="container py-5">
                            <div className="flex justify-between items-center">
                                <Logo logo={logoSetting} />
                                <div className="flex items-center gap-3">
                                    <DesktopMenu />
                                    <MobileMenu settings={settings} isMobleMenuActive={isMobleMenuActive} setIsMobleMenuActive={setIsMobleMenuActive} />
                                    <div className="flex items-center gap-4">
                                        {!isAuthenticated ? renderLoginButtons() : renderProfileMenu()}
                                        <div className="flex xl:hidden flex-col items-end cursor-pointer transition-all duration-500" onClick={() => setIsMobleMenuActive(true)}>
                                            <span className="block h-[3px] w-5 bg-muted"></span>
                                            <span className="block h-[3px] w-7.5 bg-muted mt-2"></span>
                                            <span className="block h-[3px] w-5 bg-muted mt-2"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </StickyHeader>
    );
};

export default Header;
