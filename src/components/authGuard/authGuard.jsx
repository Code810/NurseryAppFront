import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 

const AuthGuard = ({ children, requiredRole = null }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" />;
    }

    try {
        const decodedToken = jwtDecode(token);

        if (requiredRole && decodedToken?.role && !decodedToken.role.includes(requiredRole)) {
            return <Navigate to="/" />; 
        }

        return children;
    } catch (error) {
        console.error("Invalid token", error);
        return <Navigate to="/login" />;
    }
};

export default AuthGuard;
