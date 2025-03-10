import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ConnectionsView() {
    const userId = sessionStorage.getItem('_id');
    const [connections, setConnections] = useState([]);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/connect/connections/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch connections');
                const data = await response.json();
                setConnections(data);
            } catch (error) {
                console.error('Error fetching connections:', error);
            }
        };
        fetchConnections();
    }, [userId]);

    return (
        <div className='wrapperItem'>
            <div className='connections'>
                <h1> Connections </h1>
                {connections.map((connection, index) => (
                    <div className='connection-item'>
                        <Link to={`/${connection.user.username}`} key={index} style={{ textDecoration: 'none' }}>
                            <img src={connection.user.profilePhotoCrop || 'default_profile_photo_url'} alt={`${connection.user.firstName} ${connection.user.lastName}`} className="connection-profile-photo" />
                            <div>
                                <h3>{`${connection.user.firstName} ${connection.user.lastName}`}</h3>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ConnectionsView;
