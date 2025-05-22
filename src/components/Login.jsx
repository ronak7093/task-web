import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/Api";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    const newErrors = {
      email: "",
      password: ""
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

    if (newErrors.email || newErrors.password) { // Removed 'newErrors.name' as it is not used
      setError(newErrors);
      return;
    }

    if (email && password) {
      try {
        const data = await loginUser(email, password);
        console.log(data, 'user');
        if (data.code === 200) {
          if (data.data.user.isVerified) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('register', JSON.stringify(data.data.user));
            navigate('/dashboard');
          } else {
            setError({
              email: '',
              password: 'Account is not verified. Please verify your account.'
            });
          }
        } else {
          setError({
            email: '',
            password: 'Invalid email or password.'
          });
          setTimeout(() => navigate('/'), 1500); // Redirect to login page after 1.5 seconds
        }
      } catch (error) {
        console.log(error, 'error.....');

        if (error.code === 401) {
          setError(error.message);
        }
        else if (error.code === 403) {
          setError(error.message)
        }

        setTimeout(() => navigate('/'), 1500); // Redirect to login page after 1.5 seconds
      }
    }
  }

  return (
    <>
      <style>{`
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
            .form button {
              width: 100%;
              padding: 0.7rem;
              background-color: #007bff;
              border: none;
              color: white;
              font-size: 1rem;
              border-radius: 5px;
              cursor: pointer;
            }
            .form button:hover {
              background-color: #0056b3;
            }
            .form p {
              color: red;
              margin: 0.3rem 0;
            }
            .form .link {
              text-align: center;
              margin-top: 1rem;
              font-size: 0.95rem;
            }
            .form .link a {
              color: #007bff;
              text-decoration: none;
            }
            .form .link a:hover {
              text-decoration: underline;
            }
          `}</style>

      <div className="container">
        <div className="header">🔐 Login</div>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            autoComplete="email"
          />
          {error.email && <p>{error.email}</p>}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            autoComplete="current-password"
          />
          {error.password && <p>{error.password}</p>}

          {typeof error === 'string' && (
            <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>
          )}

          <button type="submit" disabled={!email || !password}>
            Login
          </button>

          <div className="link">
            <p>
              Don't have an account? <Link to="/signup">Create account</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
export default Login;