// CommentBox.js
import React from 'react';
import './documentEditor.css';

function CommentBox({ newComment, setNewComment, handleAddComment }) {
    return (
        <div className="comment-box">
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment"
            ></textarea>
            <button onClick={handleAddComment}>Add Comment</button>
        </div>
    );
}

export default CommentBox;
