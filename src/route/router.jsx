import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/root";
import Home from "@/pages/home";
import AboutUs from "@/pages/about";
import Blog from "@/pages/blog";
import Teacher from "@/pages/teacher";
import Contact from "@/pages/contact";


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
                path: "/contact",
                element: <Contact/>
            },
        ]
    },
   
])