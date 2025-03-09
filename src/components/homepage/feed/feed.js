import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './feed.css';
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import PostContent from './postContent/postContent';
import FilePreview from './filePreview/filePreview';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function Feed({ onPostClick }) {
    const [posts, setPosts] = useState([]);
    const profilePhotoCrop = sessionStorage.getItem('profilePhotoCrop');


    

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/post/feed');
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <div className="post-bar">
                <div className="post-bar-section">
                    <img src={profilePhotoCrop} alt="profile" className="profile-pic" />
                    <button className="post-input" onClick={onPostClick}>
                        Start a post
                    </button>
                </div>
                <div className="post-bar-section">
                    <button className="post-option" onClick={onPostClick}>
                        <i className="icon article-icon"></i>Document
                    </button>
                    <button className="post-option" onClick={onPostClick}>
                        <i className="icon media-icon"></i>Media
                    </button>
                </div>
            </div>
            <div className="feed">
                {posts.map((post, index) => (
                    <div key={index} className="post">
                        {post.userId && (
                            <div className="post-user">
                                <Link to={`/${post.userId.username}`} className='link-feed'>
                                    <img
                                        src={post.userId.profilePhotoCrop}
                                        alt={`${post.userId.firstName}'s profile`}
                                        className="post-user-photo"
                                    />
                                    <h4>{`${post.userId.firstName} ${post.userId.lastName}`}</h4>
                                </Link>
                            </div>
                        )}
                        <PostContent text={post.text}></PostContent>
                        {post.documentIds && post.documentIds.length > 0 && (
                            <FilePreview documents={post.documentIds} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Feed;
