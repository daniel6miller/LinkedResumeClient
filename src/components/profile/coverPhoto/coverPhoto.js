import React, { useState, useRef } from 'react';
import Modal from './modal';
import CropModal from './cropModal';
import './coverPhoto.css';

function CoverPhoto({ coverPhotoCrop, coverPhoto, canEdit }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [currentCoverPhoto, setCurrentCoverPhoto] = useState(coverPhoto);
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
        formData.append('coverPhoto', file);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/cover-photo`, { 
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Server responded with an error.');
            }
            const data = await response.json();
            setCurrentCoverPhoto(data.user.coverPhoto);
            sessionStorage.setItem('coverPhoto', data.user.coverPhoto);
            toggleCropModal();
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleCropClose = (croppedUrl) => {
        if (croppedUrl) {
            coverPhotoCrop = croppedUrl;
        }
        toggleCropModal();
        toggleModal();
        window.location.reload();
    };

    const handleDeletePhoto = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/delete-cover-photo`, {
                method: 'POST', // or 'DELETE', depending on your API design
            });
            if (!response.ok) {
                throw new Error('Failed to delete cover photo.');
            }
            const data = await response.json();
            setCurrentCoverPhoto(data.user.coverPhoto);
            sessionStorage.setItem('coverPhoto', data.user.coverPhoto);
            sessionStorage.setItem('coverPhotoCrop', data.user.coverPhotoCrop);
            toggleCropModal();
            toggleModal();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting cover photo:', error);
            alert('Failed to delete cover photo.'); // or use a more sophisticated notification system
        }
    };

    return (
        <div className="cover-photo-container">
            <div className="cover-photo" onClick={toggleModal}>
                <img src={coverPhotoCrop} alt="CoverPhoto" style={{ maxHeight: 300, width: '100%', objectFit: 'cover' }}/>
            </div>
            {modalOpen && (
                <Modal onClose={toggleModal}>
                    <div className="modal-content">
                        <img src={coverPhotoCrop || "https://linkedresume.s3.us-east-1.amazonaws.com/Website/LinkedResumeLogo3.jpg"} alt="Cover Photo" style={{ width: '50%', height: '50%', objectFit: 'cover' }} />
                        <div className="modal-actions">
                            {canEdit && <button className="cover-photo-button" onClick={toggleCropModal}>Crop Photo</button>}
                            {canEdit && <button className="cover-photo-button" onClick={() => fileInputRef.current.click()}>Change Photo</button>}
                            {canEdit && <button className="cover-photo-button" onClick={handleDeletePhoto}>Delete Photo</button>}
                        </div>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileSelect} />
                    </div>
                </Modal>
            )}
            {cropModalOpen && (
                <CropModal onClose={handleCropClose} coverPhoto={currentCoverPhoto}>
                </CropModal>
            )}
        </div>
    );
}

export default CoverPhoto;

