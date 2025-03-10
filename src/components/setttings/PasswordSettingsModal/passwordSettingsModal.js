import React, {useEffect, useState} from 'react';

const PasswordSettingsModal = ({ profileData, onClose }) => {
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState({});
    

        // function to send reset passwor email
        const resetPassword = async () => {

            try {          
              // Send the password reset email
              const resetEmailResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/user/password/reset/email/${encodeURIComponent(profileData.email)}`, {
                method: 'POST',
              });
        
              if (!resetEmailResponse.ok) {
                const resetEmailData = await resetEmailResponse.json();
                throw new Error(resetEmailData.message || 'Error sending password reset email.');
              }
          
              // Show a success message or redirect as needed
              setSuccessMessage(`Password reset email has been sent to ${profileData.email}. Please check your inbox.`);
              setTimeout(() => {
                onClose(); // Close Modal after 5 seconds
                setSuccessMessage('');
            }, 5000);
            } catch (error) {
              console.error('Error in form submission:', error);
              setErrors((prevErrors) => ({ ...prevErrors, passoword: 'Failed to process your request. Please try again later.' }));
            }
        };

    
    return (
        <>
            <p>Click the button to get a reset password email.</p>
            {errors.password && <span className="error-text">{errors.password}</span>}
            {successMessage && <p className="success-text">{successMessage}</p>}
            <button type="submit" className="submit-button settings" onClick={resetPassword}>
                    Reset Password
            </button>
        </>
    );

};

export default PasswordSettingsModal;