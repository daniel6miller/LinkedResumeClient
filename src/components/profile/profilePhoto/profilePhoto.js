import React, { useState, useRef } from 'react';
import Modal from './modal';
import CropModal from './cropModal';
import './profilePhoto.css';

function ProfilePhoto({ profilePhotoCrop, profilePhoto, canEdit }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [currentProfilePhoto, setCurrentProfilePhoto] = useState(profilePhoto);
    const userId = sessionStorage.getItem('_id');
    const fileInputRef = useRef(null);

    const toggleModal = () => {
      setModalOpen(!modalOpen);
    };

    const toggleCropModal = () => {
        setCropModalOpen(!cropModalOpen);
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('profilePhoto', file);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/profile-photo`, { 
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Server responded with an error.');
            }
            const data = await response.json();
            setCurrentProfilePhoto(data.user.profilePhoto);
            sessionStorage.setItem('profilePhoto', data.user.profilePhoto);
            toggleCropModal();
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleCropClose = (croppedUrl) => {
        if (croppedUrl) {
            profilePhotoCrop = croppedUrl;
        }
        toggleCropModal();
        toggleModal();
        window.location.reload();
    };

    const handleDeletePhoto = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/delete-profile-photo`, {
                method: 'POST', // or 'DELETE', depending on your API design
            });
            if (!response.ok) {
                throw new Error('Failed to delete profile photo.');
            }
            const data = await response.json();
            setCurrentProfilePhoto(data.user.profilePhoto);
            sessionStorage.setItem('profilePhoto', data.user.profilePhoto);
            sessionStorage.setItem('profilePhotoCrop', data.user.profilePhotoCrop);
            toggleCropModal();
            toggleModal();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting profile photo:', error);
            alert('Failed to delete profile photo.'); // or use a more sophisticated notification system
        }
    };


    return (
        <div className="profile-photo-container">
            <div className="profile-page-photo" onClick={toggleModal}>
                <img src={profilePhotoCrop} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            {modalOpen && (
                <Modal onClose={toggleModal}>
                    <div className="modal-content">
                        <img src={profilePhotoCrop} alt="Profile" style={{ width: '50%', height: '50%', objectFit: 'cover' }} />
                        <div className="modal-actions">
                            {canEdit && <button className="profile-modal-button" onClick={toggleCropModal}>Crop Photo</button>}
                            {canEdit && <button className="profile-modal-button" onClick={() => fileInputRef.current.click()}>Change Photo</button>}
                            {canEdit && <button className="profile-modal-button" onClick={handleDeletePhoto}>Delete Photo</button>}
                        </div>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileSelect} />
                    </div>
                </Modal>
            )}
            {cropModalOpen && (
                <CropModal onClose={handleCropClose} profilePhoto={currentProfilePhoto}>
                </CropModal>
            )}
        </div>
    );
}

export default ProfilePhoto;
