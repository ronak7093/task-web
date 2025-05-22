import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createData } from "../api/Api";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Corrected typo in state setter
  const [submit, setSubmit] = useState(() => {
    const data = localStorage.getItem('register');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    const newErrors = {
      name: "",
      email: "",
      password: ""
    };
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email is not valid";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }

    if (newErrors.name || newErrors.email || newErrors.password) {
      setError(newErrors);
      return;
    }

    if (name && email && password) {
      const newData = {
        id: new Date().getTime().toString(),
        name: name,
        email: email,
        password: password,
      };
      try {
        console.log('Making API call...');

        const data = await createData(newData);
        if (data.code === 201) {
          const updateUser = [...submit, data.data.user];

          localStorage.setItem('register', JSON.stringify(updateUser));
          localStorage.setItem('token', JSON.stringify(data.data.token));

          setSubmit(updateUser);

          // Clear form fields
          setName('');
          setEmail('');
          setPassword(''); // Corrected typo in state setter
          setError({
            name: '',
            email: '',
            password: ''
          });

          // Redirect user to otp page
          console.log('Navigating to OtpModel...');
          navigate('/OtpModel');
        }
      } catch (error) {
        setError({
          name: '',
          email: '',
          password: error.message // Updated error handling
        });
        console.error('Signup failed:', error);
      }
    } else {
      setError('Please fill all the fields......');
    }
  };

  return (
    <>
      <style>{`
        body {
        background: linear-gradient(135deg,rgb(76, 107, 241) 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
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
        .form input {
          width: 100%;
          padding: 0.6rem;
          margin: 0.5rem 0;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }
        .form input:focus {
          border-color: #007bff;
          outline: none;
        }
        .form button {
          width: 100%;
          padding: 0.7rem;
          background-color: #007bff;
          border: none;
          color: white;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 1rem;
        }
        .form button:hover {
          background-color: #0056b3;
        }
        p.error {
          color: #dc3545;
          font-size: 0.9rem;
          margin: 0.3rem 0;
        }
        .footer {
          text-align: center;
          margin-top: 1.5rem;
        }
        .footer a {
          color: #007bff;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="container">
        <div className="header">Signup</div>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />
          {error.name && <p className="error">{error.name}</p>}

          <input
            type="text"
            placeholder="Enter Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          {error.email && <p className="error">{error.email}</p>}

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {error.password && <p className="error">{error.password}</p>}

          <button type="submit" disabled={!name || !email || !password}>
            Signup
          </button>
        </form>

        <div className="footer">
          <p>
            Already have an account? <Link to="/">Log in here.</Link>
          </p>
        </div>
      </div>
    </>
  );
}
export default Signup;