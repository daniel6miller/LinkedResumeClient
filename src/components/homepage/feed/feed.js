import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './feed.css';
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import PostContent from './postContent/postContent';
import FilePreview from './filePreview/filePreview';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function Feed({ onPostClick }) {
    const profilePhotoCrop = sessionStorage.getItem('profilePhotoCrop');
    const userId = sessionStorage.getItem('_id');
    const [connections, setConnections] = useState([]);
    const [posts, setPosts] = useState([]);
    const [dropdownIndex, setDropdownIndex] = useState(null);

    const toggleDropdown = (index) => {
        setDropdownIndex(dropdownIndex === index ? null : index);
    };

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post/delete/${postId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            if (!response.ok) throw new Error('Failed to delete post');
    
            // Update posts state to remove the deleted post
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };
    
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
    
    useEffect(() => { 
        const fetchPosts = async () => {
            if (!userId) return; // Ensure user ID is available
    
            // Extract connection user IDs
            const connectionIds = connections.map(conn => conn.user._id);
    
            // Include the signed-in user’s ID
            const userIds = [...connectionIds, userId];
    
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post/feed`, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userIds }),
                });
    
                if (!response.ok) throw new Error('Failed to fetch posts');
                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
    
        fetchPosts();
    }, [connections, userId]); // Re-run when connections or userId changes

    const handleLike = async (postId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post/like/${postId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
    
            if (!response.ok) throw new Error('Failed to like post');
    
            // Update posts state
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId ? { ...post, likes: post.likes + 1 } : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
    
    const [commentModal, setCommentModal] = useState({ isOpen: false, postId: null, commentText: '' });

    const openCommentModal = (postId) => {
        setCommentModal({ isOpen: true, postId, commentText: '' });
    };

    const closeCommentModal = () => {
        setCommentModal({ isOpen: false, postId: null, commentText: '' });
    };


    const handleCommentSubmit = async () => {
        if (!commentModal.commentText.trim()) return;
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: commentModal.postId,
                    text: commentModal.commentText,
                    userId,
                }),
            });
    
            if (!response.ok) throw new Error('Failed to add comment');
    
            const newComment = await response.json();
    
            // Update posts state
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === commentModal.postId
                        ? { ...post, comments: [newComment, ...post.comments] }
                        : post
                )
            );
    
            closeCommentModal();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    

    const loadMoreComments = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post._id === postId ? { ...post, showAllComments: true } : post
            )
        );
    };
    

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
            {posts.length === 0 ? (
                <p>Connect with users to see their posts</p>
            ) : (
                posts.map((post, index) => (
                    <div key={index} className="post">
                        <div className="post-header">
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

                            {/* Three-dot dropdown menu */}
                            <div className="post-options">
                                <button className="options-button" onClick={() => toggleDropdown(index)}>⋮</button>
                                {dropdownIndex === index && (
                                    <div className="post-dropdown-menu">
                                        {post.userId._id === userId && (
                                            <button onClick={() => handleDeletePost(post._id)}>Delete Post</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <PostContent text={post.text} />
                        {post.documentIds && post.documentIds.length > 0 && (
                            <FilePreview documents={post.documentIds} />
                        )}

                        {/* Like & Comment Buttons */}
                        <div className="post-actions">
                            <button className="like-button" onClick={() => handleLike(post._id)}>
                                👍 {post.likes}
                            </button>
                            <button className="comment-button" onClick={() => openCommentModal(post._id)}>
                                💬 Comment
                            </button>
                        </div>

                        {/* Top Comment Display */}
                        {post.comments && post.comments.length > 0 && (
                            <div className="post-comments">
                                <>
                                    {post.showAllComments ? (
                                        post.comments.map((comment, index) => (
                                            <div key={index} className="comment">
                                                <div className="comment-header">
                                                    {comment.userId?.profilePhotoCrop && (
                                                        <img
                                                            src={comment.userId.profilePhotoCrop}
                                                            alt="Profile"
                                                            className="profile-photo"
                                                        />
                                                    )}
                                                    <strong>
                                                        {comment.userId
                                                            ? `${comment.userId.firstName} ${comment.userId.lastName}`
                                                            : "Unknown User"}
                                                    </strong>
                                                </div>
                                                <p className="comment-text">{comment.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="top-comment">
                                            <div className="comment-header">
                                                {post.comments[0].userId?.profilePhoto && (
                                                    <img
                                                        src={post.comments[0].userId.profilePhoto}
                                                        alt="Profile"
                                                        className="profile-photo"
                                                    />
                                                )}
                                                <strong>
                                                    {post.comments[0].userId
                                                        ? `${post.comments[0].userId.firstName} ${post.comments[0].userId.lastName}`
                                                        : "Unknown User"}
                                                </strong>
                                            </div>
                                            <p className="comment-text">{post.comments[0].text}</p>
                                        </div>
                                    )}

                                    {!post.showAllComments && post.comments.length > 1 && (
                                        <button
                                            className="load-more-comments"
                                            onClick={() => loadMoreComments(post._id)}
                                        >
                                            Load more comments
                                        </button>
                                    )}
                                </>
                            </div>
                        )}
                        {commentModal.isOpen && (
                            <div className="modal-overlay">
                                <div className="modal">
                                    <h3 className="modal-title">Add a Comment</h3>
                                    <textarea
                                        className="comment-input"
                                        value={commentModal.commentText}
                                        onChange={(e) => setCommentModal({ ...commentModal, commentText: e.target.value })}
                                        placeholder="Write your comment..."
                                    />
                                    <div className="modal-actions">
                                        <button className="post-button" onClick={handleCommentSubmit}>Post</button>
                                        <button className="cancel-button" onClick={closeCommentModal}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                ))
            )}
            </div>
        </div>
    );
}

export default Feed;
