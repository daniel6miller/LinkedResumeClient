import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../layout/layout';
import './searchPage.css';
import { Link } from 'react-router-dom';

function SearchPage() {
    const { query } = useParams();  // This assumes you have a route setup like "/search/:query"
    const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/search/search?term=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Could not fetch search results');
                setSearchResults(data);
            } catch (error) {
                console.error('Search fetching error:', error);
                setError(error.message);
            }
            setIsLoading(false);
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    return (
        <Layout>
            <div className="wrapper">
                <div className='wrapperItem'>
                    <div className='search'>
                        <h1>Filters</h1>
                        <h4>Users</h4>
                        <h4>Posts</h4>
                    </div>
                </div>
                <div className='wrapperItem'>
                    <div className='search'>
                        <h1>Search Results for "{query}"</h1>
                        {isLoading && <p>Loading...</p>}
                        {error && <p>Error: {error}</p>}
                        <div>
                            <h2>Users</h2>
                            {searchResults.users.length > 0 ? (
                                searchResults.users.map((user, index) => (
                                    <div key={index} className="search-result-item">
                                        <Link to={`/${user.username}`}>
                                        <span><img className="Search-img" src={user.profilePhotoCrop}></img> {user.firstName} {user.lastName}</span>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p>No users found.</p>
                            )}
                            <h2>Posts</h2>
                            {searchResults.posts.length > 0 ? (
                                searchResults.posts.map((post, index) => (
                                    <div key={index} className="search-result-item">
                                        <p>{post.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No posts found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default SearchPage;

