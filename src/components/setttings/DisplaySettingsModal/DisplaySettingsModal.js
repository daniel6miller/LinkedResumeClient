import React, {useEffect, useState} from 'react';

const DisplaySettingsModal = ({ profileData, onClose }) => {
    const [errors, setErrors] = useState({});
    const [DarkMode, setDarkMode] = useState(false); // Initialize state
    const [successMessage, setSuccessMessage] = useState('');

    // Update state when profileData becomes available
    useEffect(() => {
      if (profileData) {
        setDarkMode(profileData.darkMode);
      }
    }, [profileData]);

    const handleToggleDisplay = (event) => {
      const newDarkMode = event.target.checked; // Get the toggle's checked value
      setDarkMode(newDarkMode);
    
      try {
        handleSubmitDisplay(newDarkMode); // Pass the updated value to the handler
      } catch (error) {
        console.error("Error updating display setting:", error);
        setErrors((prevErrors) => ({ ...prevErrors, display: 'Failed to update Display Setting' }));
      }
    };

    // function to handle display changes
    const handleSubmitDisplay = async (newDarkMode) => {
      if (!profileData || !profileData.username) {
        console.error('Profile data not loaded.');
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/user/update/displayMode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: sessionStorage._id,
            darkMode: newDarkMode, // Use the passed value
          }),
        });

        if (response.ok) {
          console.log("Display setting updated successfully");
          setSuccessMessage("Display setting updated successfully!");
        } else {
          console.error("Failed to update display setting");
        }
      } catch (error) {
        console.error("Error updating display setting:", error);
        setErrors((prevErrors) => ({ ...prevErrors, display: 'Failed to update Display Setting' }));
      }
    };

    
    return (
        <>
          <form className="profile-form settings" onSubmit={handleSubmitDisplay}>
              <div className="display-toggle settings">
              <label htmlFor="private-account-toggle" className="toggle-label settings">
                  <h2>Light/Dark Display:</h2>
                  <p>
                  Light/Dark Display
                  </p>
              </label>
              <input
                  type="checkbox"
                  id="private-account-toggle"
                  checked={DarkMode}
                  onChange={handleToggleDisplay}
                  className="toggle-input"
              />
              </div>
          </form>
        </>
    );

};

export default DisplaySettingsModal;