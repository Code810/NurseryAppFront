import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/root";
import Home from "@/pages/home";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
        ]
    },
   
])