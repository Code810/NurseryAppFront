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
import RootProfile from "@/layout/rootProfile";
import Students from "@/pages/Students";
import Fees from "@/pages/Fees";
import HomeWork from "@/pages/homeWork";
import Setting from "@/pages/setting";
import AttenDance from "@/pages/attenDance";
import HomeWorks from "@/pages/HomeWorksAl";
import HomeWorkDetail from "@/pages/homeWorkDetail";
import AdminRoot from "@/layout/Admin/adminRoot";
import Dashboard from "@/pages/admin/dashboard";
import Users from "@/pages/admin/users";
import TeacherPage from "@/pages/admin/teacherPage";
import TeacherCreate from "@/pages/admin/teacherCreate";
import Parents from "@/pages/admin/parentPage";
import ParentDetail from "@/pages/admin/parentDetail";
import Blogs from "@/pages/admin/blogsPage";
import BlogDetail from "@/pages/admin/blogDetail";
import Groups from "@/pages/admin/groupPage";
import GroupDetail from "@/pages/admin/groupDetail";
import HomeWorksAdmin from "@/pages/admin/homeWorksAdmin";
import FeesPage from "@/pages/admin/feesPage";
import ContactUs from "@/pages/admin/contactUs";
import ContactDetail from "@/pages/admin/ContactDetail";
import Settings from "@/pages/admin/settings";
import ChatPage from "@/components/sections/chat/chatPage";
import AuthGuard from "@/components/authGuard/authGuard";

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
                element: <AboutUs />
            },
            {
                path: "/blog",
                element: <Blog />
            },
            {
                path: "/teacher",
                element: <Teacher />
            },
            {
                path: "/group",
                element: <Group />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/BlogDetails/:id",
                element: <BlogDetails />
            },
            {
                path: "/TeacherDetails/:id",
                element: <TeacherDetails />
            },
            {
                path: "chatPage",
                element: (
                    <AuthGuard>
                        <ChatPage />
                    </AuthGuard>
                )
            },
            {
                path: "/Profile",
                element: (
                    <AuthGuard>
                        <RootProfile />
                    </AuthGuard>
                ),
                children: [
                    {
                        path: "HomeWork",
                        element: <HomeWork />
                    },
                    {
                        path: "students",
                        element: <Students />
                    },
                    {
                        path: "fees",
                        element: <Fees />
                    },
                    {
                        path: "setting",
                        element: <Setting />
                    },
                    {
                        path: "attendace",
                        element: <AttenDance />
                    },
                    {
                        path: "homeworks",
                        element: <HomeWorks />
                    },
                    {
                        path: "homework-detail/:groupId/:homeworkId",
                        element: <HomeWorkDetail />
                    },
                ]
            },
        ]
    },
    {
        path: "/admin",
        element: (
            <AuthGuard requiredRole="admin">
                <AdminRoot />
            </AuthGuard>
        ),
        children: [
            {
                path: "/admin",
                element: <Dashboard />
            },
            {
                path: "/admin/users",
                element: <Users />
            },
            {
                path: "/admin/teachers",
                element: <TeacherPage />
            },
            {
                path: "/admin/teacherCreate",
                element: <TeacherCreate />
            },
            {
                path: "/admin/Parents",
                element: <Parents />
            },
            {
                path: "/admin/parentDetail",
                element: <ParentDetail />
            },
            {
                path: "/admin/blogs",
                element: <Blogs />
            },
            {
                path: "/admin/blogDetail",
                element: <BlogDetail />
            },
            {
                path: "/admin/groups",
                element: <Groups />
            },
            {
                path: "/admin/groupDetail",
                element: <GroupDetail />
            },
            {
                path: "/admin/homeWorks",
                element: <HomeWorksAdmin />
            },
            {
                path: "/admin/fees",
                element: <FeesPage />
            },
            {
                path: "/admin/contacts",
                element: <ContactUs />
            },
            {
                path: "/admin/contactdetail",
                element: <ContactDetail />
            },
            {
                path: "/admin/settings",
                element: <Settings />
            },
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/confirmEmail",
        element: <ConfirmEmail />
    },
    {
        path: "/ForgotPassword",
        element: <ForgotPassword />
    },
    {
        path: "/resetPassword",
        element: <ResetPassword />
    },
    {
        path: "/*",
        element: <NotFound />
    }
]);

export default router;
