import React, { createContext, useEffect, useState } from "react";
import api from "../services/api"; // Import the Axios instance

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("awesomeUsersToken"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await api.get("/api/users/me", {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    });

                    setUser(response.data); // Update the user state
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setToken(null);
                    localStorage.removeItem("awesomeUsersToken");
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    // Update localStorage when token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("awesomeUsersToken", token);
        } else {
            localStorage.removeItem("awesomeUsersToken");
        }
    }, [token]);

    return (
        <UserContext.Provider value={{ token, setToken, user, setUser, loading }}>
            {props.children}
        </UserContext.Provider>
    );
};
