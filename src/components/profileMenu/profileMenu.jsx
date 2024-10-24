import React from 'react';
import { IoChatboxEllipses, IoSettingsSharp } from "react-icons/io5";
import { BiTask } from "react-icons/bi";
import { FaCreditCard } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import user from "@/assets/images/user.png";
import { MdNoteAdd, MdOutlinePayments, MdSchool } from 'react-icons/md';
import { FaChildren } from 'react-icons/fa6';

function ProfileMenu({ decodeToken, userData }) {
  const location = useLocation();
  const roles = decodeToken?.role || [];
  return (
    <aside className="bg-white shadow-lg w-full md:w-64 md:absolute rounded-lg ms-2 top-[175px] bottom-0">
      <div className="p-6 hidden md:block">
        <nav className="space-y-4">
          <div className="flex">
            <div className="w-9">
              <img src={user} alt="" />
            </div>
            <div className="profiledata">
              <span className='block px-2 text-sm font-bold'>{decodeToken?.given_name} {decodeToken?.family_name}</span>
              <span className='block px-2 text-sm'><b>İstifadəçi: </b>{decodeToken?.unique_name}</span>
            </div>
          </div>

          {roles.includes("parent") && (
            <>
              <Link
                to="/Profile/HomeWork"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-semibold ${location.pathname === "/profile" ? "bg-blue-50" : "hover:bg-blue-50"}`}
              >
                <BiTask className="text-[#ed145b]" />
                <span>Ev Tapşırığı</span>
              </Link>
              <Link
                to="/Profile/students"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${location.pathname === "/Profile/students" ? "bg-blue-50" : "hover:bg-blue-50"}`}
              >
                <FaChildren className="text-[#ed145b]" />
                <span>Uşaqlar</span>
              </Link>
              <Link
                to="/Profile/fees"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${location.pathname === "/Profile/fees" ? "bg-blue-50" : "hover:bg-blue-50"}`}
              >
                <MdOutlinePayments className="text-[#ed145b]" />
                <span>Ödənişlər</span>
              </Link>
            </>

          )}
          {roles.includes("teacher") && (
            <>
              <Link
                to="/Profile/attendace"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${location.pathname === "/billing" ? "bg-blue-50" : "hover:bg-blue-50"}`}
              >
                <MdNoteAdd className="text-[#ed145b]" />
                <span>Jurnal</span>
              </Link>
              <Link
                to="/Profile/HomeWorks"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-semibold ${location.pathname === "/profile" ? "bg-blue-50" : "hover:bg-blue-50"}`}
              >
                <BiTask className="text-[#ed145b]" />
                <span>Tapşırıqlar</span>
              </Link>
              <Link
                to="/chatpage"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-semibold  "hover:bg-blue-50"}`}
                state={{
                  groupId: userData?.groupId || 'defaultGroupId', 
                  userId: decodeToken?.nameid
                }}
              >
                <IoChatboxEllipses className="text-[#ed145b]" />
                <span>Çat</span>
              </Link>
            </>
          )}
          <Link
            to="/Profile/setting"
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${location.pathname === "/Profile/groups" ? "bg-blue-50" : "hover:bg-blue-50"}`}
          >
            <IoSettingsSharp className="text-[#ed145b]" />
            <span>Tənzimləmələr</span>
          </Link>
        </nav>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md">
        <nav className="flex justify-around p-4">

          {roles.includes("parent") && (
            <>
              <Link to="/profile/homework" className={`text-center ${location.pathname === "/profile" ? "bg-blue-50 rounded-full p-2" : ""}`}>
                <BiTask className="text-[#ed145b] mx-auto" />
              </Link>
              <Link to="/Profile/students" className={`text-center ${location.pathname === "/Profile/students" ? "bg-blue-50 rounded-full p-2" : ""}`}>
                <FaChildren className="text-[#ed145b] mx-auto" />
              </Link>
              <Link to="/Profile/fees" className={`text-center ${location.pathname === "/Profile/fees" ? "bg-blue-50 rounded-full p-2" : ""}`}>
                <MdOutlinePayments className="text-[#ed145b] mx-auto" />
              </Link>
            </>


          )}
          {roles.includes("teacher") && (
            <Link to="/billing" className={`text-center ${location.pathname === "/billing" ? "bg-blue-50 rounded-full p-2" : ""}`}>
              <MdNoteAdd className="text-[#ed145b] mx-auto" />
            </Link>
          )}
          <Link to="/Profile/setting" className={`text-center ${location.pathname === "/Profile/groups" ? "bg-blue-50 rounded-full p-2" : ""}`}>
            <IoSettingsSharp className="text-[#ed145b] mx-auto" />
          </Link>
        </nav>
      </div>
    </aside>
  );
}

export default ProfileMenu;
