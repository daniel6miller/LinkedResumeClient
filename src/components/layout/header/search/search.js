import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import "./search.css";

function Search({ onSearch, searchResults }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleInputChange = (e) => {
        e.preventDefault(); 
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedTerm) {
            onSearch(debouncedTerm);
        }
    }, [debouncedTerm, onSearch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submit behavior
        if (location.pathname.startsWith('/search')) {
            // If already on a search page, replace the URL with the new search term
            navigate(`/search/${encodeURIComponent(debouncedTerm)}`, { replace: true });
        } else {
            // If not on a search page, navigate to the search page with the new search term
            navigate(`/search/${encodeURIComponent(debouncedTerm)}`);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                    type="text"
                    placeholder="Search for people or posts..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="search-input"
                />
                <button type="submit" className="search-button" aria-label="Search">
                    🔍
                </button>
            </form>
            {searchResults && (
                <div className="search-results">
                    {searchTerm && (
                        <div className="search-result-title" onClick={() => navigate(`/search/${encodeURIComponent(debouncedTerm)}`)}>
                            See all Results
                        </div>
                    )}
                    {searchResults.users?.map((user, index) => (
                        <div key={index} className="search-result-item">
                            <Link to={`/${user.username}`}>
                                {user.firstName} {user.lastName}
                            </Link>
                        </div>
                    ))}
                    {/* {searchResults.posts?.map((post, index) => (
                        <div key={index} className="search-result-item">
                            {post.text}
                        </div>
                    ))} */}
                </div>
            )}
        </div>
    );
}

export default Search;



