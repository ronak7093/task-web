// import React, { useState } from "react";
// import { useNavigate, useParams } from 'react-router-dom';
// import { verifyUser } from '../api/Api';

// const Verify = () => {
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const { token } = useParams();

//   const handleVerify = async () => {
//     if (!token) {
//       setError('Invalid or missing token');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const data = await verifyUser(token);
//       if (data.code === 200) {
//         const users = JSON.parse(localStorage.getItem('register')) || [];

//         if (users && users.length > 0) {
//           const lastUser = users[users.length - 1];
//           const updateUsers = users.map(user => user._id === lastUser._id ? { ...user, isVerified: true } : user);
//           localStorage.setItem('register', JSON.stringify(updateUsers));
//         }

//         setTimeout(() => navigate('/dashboard'), 1500);
//       } else if (data.code === 400) {
//         setError('Invalid or expired token');
//       }
//     } catch (err) {
//       setError('An error occurred during verification. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//             .container {
//               max-width: 600px;
//               margin: 2rem auto;
//               padding: 2rem;
//               background: #fdfdfd;
//               box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//               border-radius: 10px;
//               font-family: Arial, sans-serif;
//               text-align: center;
//             }
//             .header {
//               font-size: 2rem;
//               color: #333;
//               margin-bottom: 1rem;
//             }
//             .verify-text {
//               font-size: 1rem;
//               color: #555;
//               margin-bottom: 1.5rem;
//             }
//             .verify-button {
//               padding: 0.7rem 1.5rem;
//               background-color: #007bff;
//               border: none;
//               color: white;
//               font-size: 1rem;
//               border-radius: 5px;
//               cursor: pointer;
//             }
//             .verify-button:hover {
//               background-color: #0056b3;
//             }
//             .error {
//               color: red;
//               margin-top: 1rem;
//             }
//           `}</style>

//       <div className="container">
//         <div className="header">🔐 Verify Your Account</div>
//         <p className="verify-text">Click the button below to verify your account.</p>
//         <button className="verify-button" onClick={handleVerify} disabled={loading}>
//           {loading ? 'Verifying...' : 'Verify & Go to Dashboard'}
//         </button>
//         {error && <div className="error">{error}</div>}
//       </div>
//     </>
//   );
// };

// export default Verify;