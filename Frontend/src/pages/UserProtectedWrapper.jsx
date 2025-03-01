
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserProtectedWrapper = ({ children }) => {
    const [user, setUser] = useContext(UserDataContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/profile`,
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );
             
                if (response.status === 200) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                localStorage.removeItem("token");
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate, setUser]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default UserProtectedWrapper;