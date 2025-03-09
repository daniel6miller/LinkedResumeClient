import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './profile.css';
import Layout from '../layout/layout';
import CoverPhoto from './coverPhoto/coverPhoto';
import ProfilePhoto from './profilePhoto/profilePhoto';
import ProfileFeed from './profileFeed/profileFeed';
import Post from '../homepage/post/post';

function Profile() {
    const { username } = useParams();
    const usernameSignedIn = sessionStorage.getItem('username');
    const [showPostModal, setShowPostModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [connectionCount, setConnectionCount] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState(''); // 'Request', 'Pending', 'Connected'

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/user/username/${username}`);
                if (!response.ok) throw new Error('Profile data fetch failed');
                
                const data = await response.json();
                setProfileData(data);
                fetchConnectionCount(data._id);
                checkConnectionStatus(data._id);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        if (username) {
            fetchUserProfile();
        }
    }, [username]);

    const fetchConnectionCount = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/connect/count/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch connection count');
            const data = await response.json();
            setConnectionCount(data.count);
        } catch (error) {
            console.error('Failed to fetch connection count:', error);
        }
    };

    const checkConnectionStatus = async (userId) => {
        try {
            const loggedInUserId = sessionStorage.getItem('_id');
            // Construct the URL with proper query parameters
            const url = `http://localhost:8080/api/connect/connectionStatus?connect_request_user_id=${loggedInUserId}&connect_response_user_id=${userId}`;
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                // Map server response statuses to UI friendly text
                switch (data.status) {
                    case 'None':
                        setConnectionStatus('Connect'); // No connection exists, provide option to connect
                        break;
                    case 'requested':
                        setConnectionStatus('Request Pending'); // Connection requested, waiting response
                        break;
                    case 'accepted':
                        setConnectionStatus('Disconnect'); // Connection accepted, provide option to disconnect
                        break;
                    case 'declined':
                        setConnectionStatus('Declined'); // Connection declined, show status as declined
                        break;
                    default:
                        setConnectionStatus('Connect'); // Default case to handle unexpected status
                        break;
                };
                setConnectionCount(data.connectionCount);
                console.log(data.connectionCount);
            } else {
                throw new Error(data.message || 'Failed to fetch connection status');
            }
        } catch (error) {
            console.error('Failed to check connection status:', error);
        }
    };
    

    const handleConnectionToggle = async () => {
        await checkConnectionStatus(profileData._id);  // Ensure the latest status is fetched before deciding the action
        console.log(connectionStatus);
        let method, url, body;
    
        if (connectionStatus === 'Disconnect') {
            method = 'DELETE';
            url = `http://localhost:8080/api/connect/disconnect`;
            body = JSON.stringify({
                connect_request_user_id: sessionStorage.getItem('_id'),
                connect_response_user_id: profileData._id,
            });
        } else if (connectionStatus === 'Connect') {
            method = 'POST';
            url = `http://localhost:8080/api/connect/request`;
            body = JSON.stringify({
                connect_request_user_id: sessionStorage.getItem('_id'),
                connect_response_user_id: profileData._id,
            });
        } else {
            // If status is "Requested" or "Declined", no action is taken through this button
            console.log(`Connection status is ${connectionStatus}, no action taken.`);
            return;
        }
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });
    
            const data = await response.json();
    
            if (response.ok) {
                checkConnectionStatus(profileData._id);
                window.location.reload();
            } else {
                throw new Error(data.message || 'Failed to modify connection status');
            }
        } catch (error) {
            console.error('Error modifying connection status:', error);
        }
    };
    
    
    

    const isCurrentUser = username === usernameSignedIn;

    return (
        <div>
            <Layout>
                {profileData && (
                    <div className='profilePage'>
                        <CoverPhoto
                            coverPhotoCrop={profileData.coverPhotoCrop}
                            coverPhoto={profileData.coverPhoto}
                            canEdit={isCurrentUser}
                        />
                        <div className="profileDetails">
                            <ProfilePhoto
                                profilePhotoCrop={profileData.profilePhotoCrop}
                                profilePhoto={profileData.profilePhoto}
                                canEdit={isCurrentUser}
                            />
                            <div className="profile-info-container">
                                <h2>{profileData.firstName} {profileData.lastName}</h2>
                                <p>Connections: {connectionCount}</p>
                                {!isCurrentUser && (
                                    <button onClick={handleConnectionToggle} className='connect-button'>
                                        {connectionStatus}
                                    </button>
                                )}
                            </div>
                                   
                        </div>
                        <div className='feed-container'>
                            <ProfileFeed
                                userId={profileData._id}
                                profilePhoto={profileData.profilePhotoCrop}
                                canPost={isCurrentUser}
                                onPostClick={() => setShowPostModal(true)}
                            />
                        </div>
                    </div>
                )}
            </Layout>
            
            {showPostModal && isCurrentUser && (
                <div className="post-modal-backdrop">
                    <Post onClose={() => setShowPostModal(false)} />
                </div>
            )}
        </div>
    );
}

export default Profile;