import React from 'react';
import { Link } from 'react-router-dom';

function NavLeft() {
    const username = sessionStorage.getItem('username');

    return (
    <div className='left'>
        <Link to={`/${username}`} style={{ textDecoration: 'none' }}><h3 style={{ color: 'black' }}>Profile</h3></Link>
        <Link to={'/connections'} style={{ textDecoration: 'none' }}><h3 style={{ color: 'black' }}>Connections</h3></Link>
        <h3>Documents</h3>
        <h3>Saved</h3>
        <h3>Groups</h3>
    </div>
    );
}

export default NavLeft;