// ConnectionRequestsView.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ConnectionRequestsView() {
    const userId = sessionStorage.getItem('_id');
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/connect/requests/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch connection requests');
                const data = await response.json();
                setRequests(data);
            } catch (error) {
                console.error('Error fetching connection requests:', error);
            }
        };
        fetchRequests();
    }, [userId]);

    const handleAccept = async (connectionId) => {
        // API call to accept the connection
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/connect/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ connectionId }),
            });

            if (response.ok) {
                // Filter out the accepted request
                setRequests(prev => prev.filter(request => request.connectionId !== connectionId));
            } else {
                throw new Error('Failed to accept the connection');
            }
        } catch (error) {
            console.error('Error accepting connection:', error);
        }
    };

    const handleDecline = async (connectionId) => {
        // API call to decline the connection
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/connect/decline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ connectionId }),
            });

            if (response.ok) {
                // Filter out the declined request
                setRequests(prev => prev.filter(request => request.connectionId !== connectionId));
            } else {
                throw new Error('Failed to decline the connection');
            }
        } catch (error) {
            console.error('Error declining connection:', error);
        }
    };

    return (
        <div className='wrapperItem'>
            <div className='connections'>
                <h1>Connection Requests</h1>
                {requests.length === 0 ? (
                    <p>You have no pending connection requests.</p>
                ) : (
                requests.map((request, index) => (
                    <div key={index} className="connection-item">
                        <Link to={`/${request.requester.username}`} key={index} style={{ textDecoration: 'none' }}>
                            <img src={request.requester.profilePhotoCrop || 'default_profile_photo_url'} alt={`${request.requester.firstName} ${request.requester.lastName}`} />
                            <div>
                                <h3>{`${request.requester.firstName} ${request.requester.lastName}`}</h3>
                            </div>
                        </Link>
                        <div>
                            <button onClick={() => handleAccept(request.connectionId)}>Accept</button>
                            <button onClick={() => handleDecline(request.connectionId)}>Decline</button>
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>
    );
}

export default ConnectionRequestsView;
