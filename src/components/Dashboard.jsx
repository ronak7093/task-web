import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Task from "./Task";
import Logout from "./Logout";

const Dashboard = () => {
  const [lastUser, setLastUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("register")) || [];
    if (Array.isArray(data) && data.length > 0) {
      const lastUser = data[data.length - 1];
      if (lastUser && lastUser.isVerified) {
        setLastUser(lastUser);
      } else {
        // navigate('/OtpModel')
        setError('User is not verified. Please verify your account.');
      }
    } else if (data && typeof data === "object") {
      if (data.isVerified) {
        setLastUser(data);
      } else {
        setError('User is not verified. Please verify your account.');
        // navigate('/OtpModel')
      }
    }
  }, []);

  // return (
  //   <>
  //     <style>{`
  //       .container {
  //         max-width: 600px;
  //         margin: 2rem auto;
  //         padding: 2rem;
  //         background: #fdfdfd;
  //         box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  //         border-radius: 10px;
  //         font-family: Arial, sans-serif;
  //         text-align: center;
  //       }
  //       .header {
  //         font-size: 2rem;
  //         color: #333;
  //         margin-bottom: 1rem;
  //       }
  //       .error {
  //         color: #dc3545;
  //         margin-bottom: 1rem;
  //       }
  //       .logout-btn {
  //         margin-top: 1rem;
  //         padding: 0.7rem 1.5rem;
  //         background-color: #dc3545;
  //         border: none;
  //         color: white;
  //         font-size: 1rem;
  //         border-radius: 5px;
  //         cursor: pointer;
  //       }
  //       .logout-btn:hover {
  //         background-color: #b02a37;
  //       }
  //     `}</style>

  //     <div className="container">
  //       {error ? (
  //         <div className="error">{error}</div>
  //       ) : lastUser ? (
  //         <>
  //           <div className="header">👋 Welcome, {lastUser.name}</div>
  //           <button className="logout-btn" onClick={handleLogout}>
  //             Logout
  //           </button>
  //         </>
  //       ) : (
  //         <div>Loading.....</div>
  //       )}
  //     </div>
  //   </>
  // );

  return (
    <>
      <style>{`
          body {
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, rgb(76, 107, 241) 0%, #764ba2 100%);
          min-height: 100vh;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;  
          align-items: center;     
          text-align: center;       
          flex-direction: column;  
          overflow:hidden
        }
        .container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: #fdfdfd;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-radius: 10px;
          font-family: Arial, sans-serif;
          text-align: center;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1rem;
        }
        .task-button {
          margin-top: 1rem;
          padding: 0.7rem 1.5rem;
          background-color: #007bff;
          border: none;
          color: white;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
        }
        .task-button:hover {
          background-color: #0056b3;
        }
        .error {
          color: #dc3545;
          margin-bottom: 1rem;
        }
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
        .footer {
          margin-top: 2rem;
          font-size: 0.9rem;
          color: #888;
        }
      `}</style>

      <div className="container">
        <div className="header">
          <span style={{ marginRight: "100px" }}>👋 Welcome</span>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="task-button" onClick={() => navigate('/task')}>Task</button>
            < Logout />
          </div>
        </div>

        {error ? (
          <div className="error">{error}</div>
        ) : lastUser ? (
          <div>Welcome, {lastUser.name}</div>
        ) : (
          <div>Loading.....</div>
        )}

        <div className="footer">© 2025 Task Manager</div>
      </div>
    </>
  );

};

export default Dashboard;