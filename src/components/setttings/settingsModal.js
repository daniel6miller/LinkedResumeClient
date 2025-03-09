import React from 'react';
import './settingsModal.css';

const SettingsModal = ({ title, children, onClose }) => {
    return (
        <div className="settings-modal-backdrop settings">
            <div className="settings-modal-content">
                <header className="settings-modal-header">
                    <h2>{title}</h2>
                    <button className="settings-close-button" onClick={onClose}>
                        &times;
                    </button>
                </header>
                <div className="settings-modal-body">{children}</div>
            </div>
        </div>
    );
};

export default SettingsModal;
