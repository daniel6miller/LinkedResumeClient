import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../layout/layout';
import './settings.css';
import { Link } from 'react-router-dom';
import SettingsModal from './settingsModal';
import ProfileSettingsModal from './ProfileSettingsModal/profileSettingsModal';
import PasswordSettingsModal from './PasswordSettingsModal/passwordSettingsModal';
import PrivacySettingsModal from './PrivacySettingsModal/privacySettingsModal';
import DisplaySettingsModal from './DisplaySettingsModal/DisplaySettingsModal';
import LanguageSettingsModal from './LanguageSettingsModal/LanguageSettingsModal';
import CloseAccountModal from './CloseAccountModal/CloseAccountModal';

function Settings() {
    const [username, setUsername] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [activeModal, setActiveModal] = useState(null); // Tracks which modal is open
    const [isChecking, setIsChecking] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isPrivate, setIsPrivate] = useState(false); // Initialize state
    const [userDisplayMode, setUserDisplayMode] = useState('Light');
    const [errors, setErrors] = useState({});


    const handleToggleDisplayMode = () => {
        setUserDisplayMode((prevState) => !prevState);
        handleSubmitDisplayMode();
      };

    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
    });

    useEffect(() => {
        // Retrieve username from sessionStorage on mount
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            console.warn("Username not found in sessionStorage");
        }
    }, []);    

  
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!username) return; // Wait until username is available
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/username/${username}`);
                if (!response.ok) throw new Error(`Profile data fetch failed: ${response.status}`);
                
                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        fetchUserProfile();
    }, [username]); // Trigger fetch when username updates

    // function to handle Display changes
    const handleSubmitDisplayMode = async () => {
        if (!profileData || !profileData.username) {
            console.error('Profile data not loaded.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/update/displayMode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: sessionStorage._id,
                    displayMode: userDisplayMode,
                }),
            });
        
            if (response.ok) {
                console.log("Display mode updated successfully");
            } else {
                console.error("Failed to update display mode");
            }
            } catch (error) {
            console.error("Error updating display mode:", error);
            }
    };

    const openModal = (modalName) => {
        setActiveModal(modalName);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    return (
        <div>
            <Layout>
                <div className="wrapper settings">
                    <div className='wrapperItem settings'>
                        <h2>Profile Information</h2>
                        <button onClick={() => openModal('profile')}>Name, Username, Email and Phone</button>
                        <br></br>
                        <button onClick={() => openModal('password')}>Password Reset</button>
                        <br></br>
                        <button onClick={() => openModal('privacy')}>Privacy</button>

                        <h2>Display</h2>
                        <button onClick={() => openModal('display')}>Coming Soon: Dark/Light Mode</button>

                        <h2>General Preferences</h2>
                        <button onClick={() => openModal('language')}>Coming Soon: Language</button>
                        <br></br>
                        <button onClick={() => openModal('closeAccount')}>Coming Soon: Close Account</button>
                    </div>
                </div>
            </Layout>

            {/* Conditional Rendering for Modals */}
            {activeModal === 'profile' && (
                <SettingsModal title="Edit Profile" onClose={closeModal}>
                    <ProfileSettingsModal profileData={profileData} onClose={closeModal}></ProfileSettingsModal>
                </SettingsModal>
            )}
            {activeModal === 'password' && (
                <SettingsModal title="Reset Password" onClose={closeModal}>
                    <PasswordSettingsModal profileData={profileData} onClose={closeModal}></PasswordSettingsModal>
                </SettingsModal>
            )}
            {activeModal === 'privacy' && (
                <SettingsModal title="Account Privacy" onClose={closeModal}>
                    <PrivacySettingsModal profileData={profileData} onClose={closeModal}></PrivacySettingsModal>
                </SettingsModal>
            )}
            {activeModal === 'display' && (
                <SettingsModal title="Display Settings" onClose={closeModal}>
                    <DisplaySettingsModal profileData={profileData} onClose={closeModal}></DisplaySettingsModal>
                </SettingsModal>
            )}
            {activeModal === 'language' && (
                <SettingsModal title="Language Preferences" onClose={closeModal}>
                    <LanguageSettingsModal profileData={profileData} onClose={closeModal}></LanguageSettingsModal>
                </SettingsModal>
            )}
            {activeModal === 'closeAccount' && (
                <SettingsModal title="Close Account" onClose={closeModal}>
                    <CloseAccountModal profileData={profileData} onClose={closeModal}></CloseAccountModal>
                </SettingsModal>
            )}
        </div>
    );
}

export default Settings;


