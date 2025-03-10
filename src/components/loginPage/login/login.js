import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

function Login({ onSignUpClick, onForgetPasswordClick }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let tempErrors = {};
        // Validate required fields
        if (!username) {
            tempErrors.username = "Please provide your username?";
        }
        if (!password) {
            tempErrors.password = "Please provide a password";
        }
            // Add other validations for password, etc.
  
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;  // Return true if no errors
    }

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent the default form submit behavior
        if (!validateForm()) {
            console.error('Validation errors', errors);
            return; // Stop the form from submitting if there are validation errors
          }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, data.user); // Pass user data to login
                console.log('Login successful:', data);
                sessionStorage.setItem('username', data.user.username);
                sessionStorage.setItem('firstName', data.user.firstName);
                sessionStorage.setItem('lastName', data.user.lastName);
                sessionStorage.setItem('_id', data.user._id);
                sessionStorage.setItem('coverPhoto', data.user.coverPhoto);
                sessionStorage.setItem('coverPhotoCrop', data.user.coverPhotoCrop);
                sessionStorage.setItem('profilePhoto', data.user.profilePhoto);
                sessionStorage.setItem('profilePhotoCrop', data.user.profilePhotoCrop);
                sessionStorage.setItem('displayMode', data.user.displayMode);
                navigate('/home'); // Redirect to home page
            } else {
                console.error('Login failed:', data.message);
                setErrors({ ...errors, username: 'Username or Password is incorrect' });
                setErrors({ ...errors, password: '' });
                // Handle errors, such as showing a notification to the user
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form center" onSubmit={handleLogin}>
                {errors.username && <span className="error-text">{errors.username}</span>}
                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Log In</button>
                <hr />
                <button type="button" className="create-account" onClick={onSignUpClick}>
                    Create new account
                </button>
                <button type="button" className="forget-password" onClick={onForgetPasswordClick}>
                    Forgot your Password?
                </button>
                {/* <div className="create-page">
                    <a href="#create-page">Create a Page</a> for a group, brand, or business.
                </div> */}
            </form>
        </div>
    );
};

export default Login;