import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Logout = () => {
    const [lastUser, setLastUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('register')) || [];
        if (Array.isArray(data) && data.length > 0) {
            const lastUser = data[data.length - 1];
            if (lastUser && lastUser.isVerified) {
                setLastUser(lastUser);
            }
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("register");
        localStorage.removeItem('token');
        toast.success('logout sucessfully')
        navigate('/')
    };
    return (
        <>
            <style>{`
        .logout-btn {
          margin-top: 1rem;
          padding: 0.7rem 1.5rem;
          background-color: #dc3545;
          border: none;
          color: white;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
        }
        .logout-btn:hover {
          background-color: #b02a37;
        }
        `}</style>
            {/* <div className="header">👋 Welcome, {lastUser.name}</div> */}
            < Toaster position="top-right" />
            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </>
    );
};

export default Logout;