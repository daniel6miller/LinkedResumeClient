import React from 'react';
import { Link } from 'react-router-dom';

function NavLeft() {
    const username = sessionStorage.getItem('username');

    return (
    <div className='left'>
        <Link to={`/${username}`} style={{ textDecoration: 'none' }}><h3 style={{ color: 'black' }}>Profile</h3></Link>
        <Link to={'/connections'} style={{ textDecoration: 'none' }}><h3 style={{ color: 'black' }}>Connections</h3></Link>
    </div>
    );
}

export default NavLeft;