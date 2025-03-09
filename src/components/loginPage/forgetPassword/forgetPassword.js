import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './forgetPassword.css';

const ForgetPassword = ({ onClose }) => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validateForm = () => {
    let tempErrors = {};
  
    // Validate email format using a regular expression
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!values.email) {
      tempErrors.email = "Email is required.";
    } else if (!emailPattern.test(values.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
  
    // Add other validations for password, etc.
  
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;  // Return true if no errors
  };
      
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error('Validation errors', errors);
      return; // Stop the form from submitting if there are validation errors
    }

    try {
      // Check if there is an account associated with the email
      const emailCheckResponse = await fetch(`http://localhost:8080/api/user/check-email/${encodeURIComponent(values.email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const emailCheckData = await emailCheckResponse.json();

      if (!emailCheckResponse.ok) {
        throw new Error(emailCheckData.message || 'Error checking email.');
      }
      console.log(emailCheckResponse)
      if (emailCheckData.available) {
        setErrors({ email: 'This email does not have an account associated with it.' });
        return; // Stop submission if the email does not exist
      }
      
      // If email exists, send the password reset email
      const resetEmailResponse = await fetch(`http://localhost:8080/api/user/password/reset/email/${encodeURIComponent(values.email)}`, {
        method: 'POST',
      });

      if (!resetEmailResponse.ok) {
        const resetEmailData = await resetEmailResponse.json();
        throw new Error(resetEmailData.message || 'Error sending password reset email.');
      }
  
      // Show a success message or redirect as needed
      setSuccessMessage('Password reset email has been sent. Please check your inbox.');
      return;
    } catch (error) {
      console.error('Error in form submission:', error);
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Failed to process your request. Please try again later.' }));
    }
  };


  return (
    <div className="forgetPassword-form-container">
      <div class="forgetPassword-form-container2">
        <button className="close-button" onClick={onClose}>X</button>
        {!successMessage &&
        <form className="forgetPassword-form" onSubmit={handleSubmit}>
          <h1>Forgot Your Password?</h1>
          {errors.email && <span className="error-text">{errors.email}</span>}
          <input id="email" name="email" type="text" placeholder="Email" value={values.email} onChange={handleInputChange} />

          <button type="submit" className="forgetPassword-button">Send Password Reset Email</button>
        </form>}
        {/* Display the success message if there is one */}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div> 
    </div>
  );
};
  
  export default ForgetPassword;