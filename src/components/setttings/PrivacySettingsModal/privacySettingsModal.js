import React, {useEffect, useState} from 'react';

const PrivacySettingsModal = ({ profileData, onClose }) => {
    const [errors, setErrors] = useState({});
    const [isPrivate, setIsPrivate] = useState(false); // Initialize state
    const [successMessage, setSuccessMessage] = useState('');

    // Update state when profileData becomes available
    useEffect(() => {
      if (profileData) {
        setIsPrivate(profileData.privateAccount);
      }
    }, [profileData]);

    const handleTogglePrivacy = (event) => {
      const newIsPrivate = event.target.checked; // Get the toggle's checked value
      setIsPrivate(newIsPrivate);
    
      try {
        handleSubmitPrivacy(newIsPrivate); // Pass the updated value to the handler
      } catch (error) {
        console.error("Error updating privacy setting:", error);
        setErrors((prevErrors) => ({ ...prevErrors, privacy: 'Failed to update Privacy Setting' }));
      }
    };

    // function to handle privacy changes
    const handleSubmitPrivacy = async (newIsPrivate) => {
      if (!profileData || !profileData.username) {
        console.error('Profile data not loaded.');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/update/privacy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: sessionStorage._id,
            privateAccount: newIsPrivate, // Use the passed value
          }),
        });

        if (response.ok) {
          console.log("Privacy setting updated successfully");
          setSuccessMessage("Privacy setting updated successfully!");
        } else {
          console.error("Failed to update privacy setting");
        }
      } catch (error) {
        console.error("Error updating privacy setting:", error);
        setErrors((prevErrors) => ({ ...prevErrors, privacy: 'Failed to update Privacy Setting' }));
      }
    };

    
    return (
        <>
          <form className="profile-form settings" onSubmit={handleSubmitPrivacy}>
              <div className="privacy-toggle settings">
              {errors.password && <span className="error-text">{errors.password}</span>}  
              <label htmlFor="private-account-toggle" className="toggle-label settings">
                  <h2>Private Account:</h2>
                  <p>
                  When your account is public, your profile and posts can be seen by anyone,
                  on or off Instagram, even if they don't have an Instagram account. When your account is private, only the followers you approve can see what you share.
                  </p>
              </label>
              <input
                  type="checkbox"
                  id="private-account-toggle"
                  checked={isPrivate}
                  onChange={handleTogglePrivacy}
                  className="toggle-input"
              />
              </div>
          </form>
        </>
    );

};

export default PrivacySettingsModal;