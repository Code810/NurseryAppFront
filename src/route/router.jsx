import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/root";
import Home from "@/pages/home";
import AboutUs from "@/pages/about";
import Blog from "@/pages/blog";
import Teacher from "@/pages/teacher";
import Contact from "@/pages/contact";
import Login from "@/pages/Login";
import Register from "@/pages/register";
import ConfirmEmail from "@/pages/confirmEmail";
import ForgotPassword from "@/pages/forgotPassword";
import ResetPassword from "@/pages/resetPassword";
import NotFound from "@/pages/notfound";
import Group from "@/pages/group";
import BlogDetails from "@/pages/blog-details";
import TeacherDetails from "@/pages/teacher-details";
import Profile from "@/pages/profile";
import ProfileMenu from "@/components/profileMenu/profileMenu";
import RootProfile from "@/layout/rootProfile";
import Students from "@/pages/Students";
import Fees from "@/pages/Fees";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/about-us",
                element: <AboutUs/>
            },
            {
                path: "/blog",
                element: <Blog/>
            },
            {
                path: "/teacher",
                element: <Teacher/>
            },
            {
                path: "/group",
                element: <Group/>
            },
            {
                path: "/contact",
                element: <Contact/>
            },
            {
                path: "/BlogDetails/:id",
                element: <BlogDetails/>
            },
            {
                path: "/TeacherDetails/:id",
                element: <TeacherDetails/>
            },
            {
                path: "/Profile",
                element: <RootProfile/>,
                children: [
                    {
                        path: "/Profile",
                        element: <Profile/>
                    },
                    {
                        path: "/Profile/students",
                        element: <Students/>
                    },
                    {
                        path: "/Profile/fees",
                        element: <Fees/>
                    },
                ]},
        ]
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/confirmEmail",
        element: <ConfirmEmail/>
    },
    {
        path: "/ForgotPassword",
        element: <ForgotPassword/>
    },
    {
        path: "/resetPassword",
        element: <ResetPassword/>
    },
    {
        path: "/*",
        element: <NotFound/>
    },
    
   
])