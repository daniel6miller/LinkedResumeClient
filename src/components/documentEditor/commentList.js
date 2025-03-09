// CommentList.js
import React from 'react';
import Comment from './comment';
import './documentEditor.css';

function CommentList({ comments, editCommentId, editCommentText, setEditCommentText, handleEditComment, handleRemoveComment, setEditCommentId, userSignedIn }) {
    return (
        <div className="comments-section">
            <h3>Comments</h3>
            {comments.map((comment, index) => (
                <Comment
                    key={index}
                    comment={comment}
                    editCommentId={editCommentId}
                    editCommentText={editCommentText}
                    setEditCommentText={setEditCommentText}
                    handleEditComment={handleEditComment}
                    handleRemoveComment={handleRemoveComment}
                    setEditCommentId={setEditCommentId}
                    userSignedIn={userSignedIn}
                />
            ))}
        </div>
    );
}

export default CommentList;