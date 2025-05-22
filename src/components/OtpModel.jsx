import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtpUser, resendOtpUser } from '../api/Api';

const OtpModel = () => {
    const totalTime = 60;
    const [Otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // const [timeLeft, setTimeLeft] = useState(60); // Set initial timeLeft to 1 minute (60 seconds)
    const [timeLeft, setTimeLeft] = useState(() => {
        const saved = localStorage.getItem('otp-timer');
        const expiry = saved ? parseInt(saved) : Date.now() + totalTime * 1000;
        return Math.max(0, Math.floor((expiry - Date.now()) / 1000));
    }); // Set initial timeLeft to 1 minute (60 seconds)

    const navigate = useNavigate();
    const inputRefs = useRef([]);

    useEffect(() => {
        const expiryTime = Date.now() + timeLeft * 1000;
        localStorage.setItem('otp-timer', expiryTime);

        const interval = setInterval(() => {
            const newTime = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
            setTimeLeft(newTime);

            if (newTime <= 0) {
                clearInterval(interval);
                localStorage.removeItem('otp-timer');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    const handleChange = async (value, index) => {

        if (!/^\d*$/.test(value)) {
            setError(' Only digits are allowed.');
            return;
        }
        const newOtp = [...Otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < Otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (Otp[index] === "") {
                if (index > 0) {
                    inputRefs.current[index - 1].focus();
                }
            }
        } else if (e.key === 'ArrowLeft') {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
            else if (e.key === 'ArrowRight') {
                if (index < length - 1) {
                    inputRefs.current[index + 1].focus();
                }
            }
        }
    };

    const handleVerify = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
            setError('No token found. Please log in again.');
            return;
        }

        const otpString = Otp.join(''); // Combine the OTP array into a single string
        if (otpString.length !== 6) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }

        try {
            const verifyData = await verifyOtpUser(token, otpString);
            if (verifyData.code === 200) {
                setSuccess(verifyData.message);

                const users = JSON.parse(localStorage.getItem('register')) || [];
                if (users && users.length > 0) {
                    const lastUser = users[users.length - 1];
                    const updateUsers = users.map(user =>
                        user._id === lastUser._id ? { ...user, isVerified: true } : user
                    );
                    localStorage.setItem('register', JSON.stringify(updateUsers));
                }
                setTimeout(() => navigate('/dashboard'), 1500);
                setError('');
            } else {
                setError(verifyData.message || 'An unexpected error occurred.');
                setSuccess('');
            }
        } catch (error) {
            if (error.code === 400) {
                setError(error.message || 'Invalid OTP. Please try again.');
            } else {
                setError('An error occurred while verifying OTP. Please try again.');
            }
            setSuccess('');
        }
    };

    const handleResendOtp = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
            setError('No token found. Please log in again.');
            return;
        }

        try {
            const response = await resendOtpUser(token); // Call the resend OTP API
            if (response.code === 200) {
                setSuccess('OTP has been resent successfully.');
                setError('');
                setTimeLeft(60); // Reset the timer to 1 minute
                localStorage.setItem('timeLeft', 60); // Save the new timer value
                localStorage.setItem('timestamp', Date.now()); // Save the current timestamp
            } else {
                setError('Failed to resend OTP. Please try again.');
                setSuccess('');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            setError('An error occurred while resending OTP. Please try again.');
            setSuccess('');
        }
    };

    return (
        <>
            <style>{`
            body {
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg,rgb(76, 107, 241) 0%, #764ba2 100%);
            min-height: 100vh;
            font-family: Arial, sans-serif;
           }
            .container {
              max-width: 600px;
              margin: 2rem auto;
              padding: 2rem;
              background: #fdfdfd;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              border-radius: 10px;
              font-family: Arial, sans-serif;
            }
            .header {
              text-align: center;
              font-size: 2rem;
              color: #333;
              margin-bottom: 1rem;
            }
            .paragraph{
             text-align: center;
            }
            .otp-input {
              display: flex;
              justify-content: center;
              gap: 10px;
              margin-top: 1rem;
            }
            .otp-input input {
              width: 40px;
              height: 40px;
              text-align: center;
              font-size: 18px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .resend {
              margin-top: 1rem;
              color: #007bff;
              cursor: pointer;
            }
            .resend:hover {
              text-decoration: underline;
            }
            .time-left {
              margin-top: 1rem;
              font-size: 1rem;
              color: #555;
            }
            .verify {
              width: 100%;
              padding: 0.7rem;
              background-color: #007bff;
              border: none;
              color: white;
              font-size: 1rem;
              border-radius: 5px;
              cursor: pointer;
            }
            .verify:hover {
              background-color: #0056b3;
            }
          `}</style>

            <div className="container">
                <div className="header">🔐 OTP Verification</div>
                <p className="paragraph">Please enter the 6-digit code sent to your device</p>

                <div className="otp-input">
                    {
                        Otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputRefs.current[i] = el)}
                                type="tel"
                                inputMode="numeric"
                                maxLength={1}
                                pattern="[0-9]*"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                            />
                        ))
                    }
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {timeLeft > 0 ? (
                    <p className="time-left">Time left: {timeLeft} seconds</p>
                ) : (
                    <p className="resend">Didn't receive code? <button onClick={() => handleResendOtp()} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Resend OTP</button></p>
                )}
                <button className="verify" onClick={() => handleVerify()}>Verify OTP</button>
            </div>
        </>
    );
};

export default OtpModel;