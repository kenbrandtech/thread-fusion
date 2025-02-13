"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const UserAuthContext = createContext();

export const UserAuthContextProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loginStatus, setLoginStatus] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            const storedProfile = localStorage.getItem("profile");
            const storedLoginStatus = localStorage.getItem("loginStatus");

            if (storedUser) setUser(JSON.parse(storedUser));
            if (storedProfile) setProfile(JSON.parse(storedProfile));
            if (storedLoginStatus !== null) setLoginStatus(storedLoginStatus === "true");
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (user.length > 0) {
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                localStorage.removeItem("user");
            }
            if (profile) {
                localStorage.setItem("profile", JSON.stringify(profile));
            } else {
                localStorage.removeItem("profile");
            }
            localStorage.setItem("loginStatus", loginStatus.toString());
        }
    }, [user, profile, loginStatus]);

    const logout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to logout",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Logout",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            setUser([]);
            setProfile(null);
            setLoginStatus(false);
            if (typeof window !== "undefined") {
                localStorage.removeItem("loginStatus");
                localStorage.removeItem("profile");
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
            localStorage.removeItem("loginStatus");
            localStorage.removeItem("profile");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            router.push("/");
        }
    };

    return (
        <UserAuthContext.Provider
            value={{
                user,
                setUser,
                profile,
                setProfile,
                loginStatus,
                setLoginStatus,
                logout
            }}
        >
            {children}
        </UserAuthContext.Provider>
    );
};

export const UserAuthContextDetails = () => useContext(UserAuthContext);
