import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

function Header({ author, title }) {
    const profilePhotoCrop = sessionStorage.getItem('profilePhotoCrop');
    const username = sessionStorage.getItem('username');

    return (
        <div className="navTop">
            <div className="navItem">
                <Link to="/home">
                    <img src="http://localhost:3000/img/LinkedResumeGPTLogo3.jpg" alt="Logo" />
                </Link>
                <div className="title-author">
                    <h3>{title}</h3>
                    <p>Created by: {author}</p>
                </div>
            </div>
            <div className="navItem center"></div>
            <div className="navItem">
                <Link to={`/${username}`} className="link-nav">
                    <img src={profilePhotoCrop} className="navTitle" alt="Profile" />
                </Link>
            </div>
        </div>
    );
}

export default Header;



