import React from "react";

const NotFound = () => {
    return (
        <>
            <style>{`
            .notfound-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
        }
        .notfound-image {
            max-width: 700px;
            width: 100%;
            margin-bottom: 20px;
        }
        `}</style>
            <div className="notfound-container">
                <img src="/public/404-status-code.png" alt="404 not found" className="notfound-image" />
            </div>
        </>
    );
};

export default NotFound;