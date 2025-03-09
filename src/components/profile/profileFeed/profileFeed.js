import React, { useState, useEffect } from 'react';
import './profileFeed.css';

function ProfileFeed({ userId, profilePhoto, canPost, onPostClick }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/post/${userId}`);
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
  }, [userId]);

  const isImage = (url) => /\.(jpeg|jpg|gif|png)$/.test(url.toLowerCase());
  const isPDF = (url) => /\.pdf$/.test(url.toLowerCase());
  const isDoc = (url) => /\.doc$/.test(url.toLowerCase());
  const isDocx = (url) => /\.docx$/.test(url.toLowerCase());

  return (
    <div>
      {canPost && (
        <div className="post-bar">
          <div className="post-bar-section">
            <img src={profilePhoto} alt="profile" className="profile-pic" />
            <button className="post-input" onClick={onPostClick}>
              Start a post
            </button>
          </div>
          <div className="post-bar-section">
            <button className="post-option" onClick={onPostClick}>
              <i className="icon media-icon"></i>Media
            </button>
            <button className="post-option" onClick={onPostClick}>
              <i className="icon event-icon"></i>Event
            </button>
            <button className="post-option" onClick={onPostClick}>
              <i className="icon article-icon"></i>Write article
            </button>
          </div>
        </div>
      )}
      <div className="feed">
        {posts.map((post, index) => (
          <div key={index} className="post">
            {post.userId && (
              <div className="post-user">
                <img src={post.userId.profilePhotoCrop} alt={`${post.userId.firstName}'s profile`} className="post-user-photo"/>
                <h4>{`${post.userId.firstName} ${post.userId.lastName}`}</h4>
              </div>
            )}
            <p>{post.text}</p>
            {post.documentId && (
              <div className="post-document">
                <a href={`/document/${post.documentId._id}`} target="_blank" rel="noopener noreferrer">
                  {isImage(post.documentId.amazonS3Link) && <img src={post.documentId.amazonS3Link} alt="Post media" className="post-media" />}
                  {isPDF(post.documentId.amazonS3Link) && (
                    <>
                      <img src="http://localhost:3000/img/pdfIcon.png" alt="PDF thumbnail" className="pdf-thumbnail" />
                      View PDF
                    </>
                  )}
                  {(isDoc(post.documentId.amazonS3Link) || isDocx(post.documentId.amazonS3Link)) && (
                    <>
                      <img src="http://localhost:3000/img/docIcon.png" alt="Word document" className="word-thumbnail" />
                      View Document
                    </>
                  )}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileFeed;
