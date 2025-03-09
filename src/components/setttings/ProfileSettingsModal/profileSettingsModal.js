import React, {useEffect, useState} from 'react';

const ProfileSettingsModal = ({ profileData, onClose }) => {
    const [username, setUsername] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { id, value } = e.target; // Use id here
        setValues({ ...values, [id]: value }); // Update based on id
    };

    // Update state when profileData becomes available
    useEffect(() => {
        if (profileData) {
            setValues({
                firstName: profileData.firstName || '',
                lastName: profileData.lastName || '',
                username: profileData.username || '',
            });
        }
    }, [profileData]);

    const validateForm = () => {
        let tempErrors = {};
        
        // Validate required fields
        if (!values.firstName) {
          tempErrors.firstName = "Please provide your first name";
        }
        if (!values.lastName) {
          tempErrors.lastName = "Please provide your last name";
        }

        if (!values.username) {
            tempErrors.username = "Please provide a username";
        }
      
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;  // Return true if no errors
    };

    const handleSubmitProfile = async  (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.error('Validation errors',errors);
            return; // stop the form from submitting if their are validation errors
        }
    
        // Check if the username is already in use
        try {
            if (!profileData || !profileData.username) {
                console.error('Profile data not loaded.');
                return;
            }
        
            setIsChecking(true); // Start loading spinner if desired
        
            const response = await fetch(`http://localhost:8080/api/user/check-username/${values.username}`);
            setIsChecking(false); // Stop loading
        
            if (!response.ok) throw new Error('Failed to check username availability.');
        
            const data = await response.json();
            if (!data.available && values.username !== profileData.username) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    username: 'Username is already taken.',
                }));
                return; // Stop submission
            }
        } catch (error) {
            setIsChecking(false); // Stop loading even if there's an error
            console.error('Error checking username:', error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                username: 'An error occurred while checking username availability.',
            }));
            return; // Stop submission
        }

        // Update Users Data
        try {
            const response = await fetch('http://localhost:8080/api/user/update/info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: sessionStorage._id,
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username,
            }),
            });
        
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Users Information Updated:', data);
    

            // Display success message and update session storage
            setSuccessMessage('Your information has been updated.');
            sessionStorage.setItem('username', values.username);
            sessionStorage.setItem('firstName', values.firstName);
            sessionStorage.setItem('lastName', values.lastName);
            setTimeout(() => {
                onClose(); // Close Modal after 3 seconds
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Failed to update users data', error);
            // Handle errors
        }
    }
    
    return (
        <>
            <p>Here you can edit your profile information.</p>
            <form className="profile-form settings" onSubmit={handleSubmitProfile}>
                <div className="form-group settings">
                    <label htmlFor="firstName">First Name:</label>
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    <input
                        type="text"
                        id="firstName"
                        placeholder={profileData ? profileData.firstName : 'Loading...'}
                        defaultValue={profileData ? profileData.firstName : ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group settings">
                    <label htmlFor="lastName">Last Name:</label>
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    <input
                        type="text"
                        id="lastName"
                        placeholder={profileData ? profileData.lastName : 'Loading...'}
                        defaultValue={profileData ? profileData.lastName : ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group settings">
                    <label htmlFor="username">Username:</label>
                    {errors.username && <span className="error-text">{errors.username}</span>}
                    <input
                        type="text"
                        id="username"
                        placeholder={profileData ? profileData.username : 'Loading...'}
                        defaultValue={profileData ? profileData.username : ''}
                        onChange={handleInputChange}
                    />
                </div>
                <span className="inline-container settings">
                    <h2>Email:</h2>
                    <p>{profileData ? profileData.email : 'Loading...'}</p>
                </span>
                <span className="inline-container settings">
                    <p>Contact support to update email associated with account</p>
                </span>
                {successMessage && <p className="success-text">{successMessage}</p>}
                <button type="submit" className="submit-button settings">
                    Save Changes
                </button>
            </form>
        </>
    );

};

export default ProfileSettingsModal;