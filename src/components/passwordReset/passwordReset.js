import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Brand from '../loginPage/brand/brand';
import './passwordReset.css';

function PasswordReset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchParams] = useSearchParams(); // To get token from the URL query
  const navigate = useNavigate();

  const token = searchParams.get('token'); // Extract the token from the URL

  // Function to validate and reset the password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!password || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Step 1: Validate the token
      console.log(token); // remove this after debugging
      const validateResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/user/password/reset/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!validateResponse.ok) {
        const validateError = await validateResponse.json();
        throw new Error(validateError.message || 'Invalid or expired token.');
      }

      // Step 2: Reset the password
      const resetResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/user/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!resetResponse.ok) {
        const resetError = await resetResponse.json();
        throw new Error(resetError.message || 'Failed to reset the password.');
      }

      // Display success message and redirect
      setSuccessMessage('Your password has been reset successfully.');
      setTimeout(() => {
        navigate('/'); // Redirect to login page after 3 seconds
      }, 3000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="wrapper password-reset">
      <div className="wrapperItem">
        <Brand />
      </div>
      <div className="wrapperItem">
        <form className="password-reset-form" onSubmit={handleResetPassword}>
          <h2>Reset Your Password</h2>
          {error && <p className="error-text">{error}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}

          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="reset-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;


