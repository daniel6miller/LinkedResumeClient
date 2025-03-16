import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Search from './search/search';
import "./header.css";

function Header() {
    const navigate = useNavigate();
    const profilePhotoCrop = sessionStorage.getItem('profilePhotoCrop');
    const username = sessionStorage.getItem('username');

    const [searchResults, setSearchResults] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            //Make an API call to log out if needed
            // await fetch('http://localhost:8080/api/auth/logout', { method: 'POST', credentials: 'include' });

            // Clear session data
            sessionStorage.clear();

            // Redirect to home page
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Function to handle search, wrapped with useCallback
    const handleSearch = useCallback(async (searchTerm) => {
        console.log('Searching for:', searchTerm);
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/search/search?term=${encodeURIComponent(searchTerm)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Search results:', data);
                setSearchResults(data); // Set the search results
            } else {
                console.error('Search failed:', data.message);
            }
        } catch (error) {
            console.error('Error during search:', error);
        }
    }, []);  // Empty array means the function is created only once

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownOpen((prevState) => !prevState);
    };

    // Close the dropdown if clicked outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest('.profile-dropdown-container')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);
    
    return (
        <header>
            <nav id="nav">
                <div className="navTop">
                    <div className="navItem navTop">
                        <Link to="/home"><img src="https://linkedresume.s3.us-east-1.amazonaws.com/Website/LinkedResumeLogo3.jpg" alt="Logo"></img></Link>
                        <Search onSearch={handleSearch} searchResults={searchResults} />
                    </div>
                    <div className="navItem navTop navCenter">
                        {/* <Link to="/home" className='link-nav'><i className='bx bx-home' id="home-icon"></i></Link> */}
                        {/* <Link to="/files" className='link-nav'><i className='bx bx-file' id="file-icon"></i></Link>
                        <h1 className="navTitle"><Link to="/friends" className='link-nav'>Network</Link></h1>
                        <h1 className="navTitle"><Link to="/explore" className='link-nav'>Explore</Link></h1> */}
                    </div>
                    <div className="navItem navTop profile-dropdown-container">
                        <img
                            src={profilePhotoCrop}
                            className="navTitle profile"
                            alt="Profile"
                            onClick={toggleDropdown}
                        />
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to={`/${username}`} className="dropdown-item">Profile</Link>
                                <Link to="/settings" className="dropdown-item">Settings</Link>
                                <button onClick={handleSignOut} className="dropdown-item">Sign Out</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
