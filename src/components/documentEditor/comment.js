import React from 'react';

function Comment({ comment, editCommentId, editCommentText, setEditCommentText, handleEditComment, handleRemoveComment, setEditCommentId, userSignedIn }) {
    return (
        <div className="comment">
            <div className="comment-header">
                <img src={comment.createdBy.profilePhotoCrop} alt="Profile" className="comment-profile-pic" />
                <div className="comment-user-info">
                    <p className="comment-user-name">{comment.createdBy.firstName} {comment.createdBy.lastName}</p>
                    <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
            </div>
            {editCommentId === comment._id ? (
                <div>
                    <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                    />
                    <button onClick={() => handleEditComment(comment._id, editCommentText)}>Save</button>
                    <button onClick={() => setEditCommentId(null)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p>{comment.text}</p>
                    {comment.createdBy._id === userSignedIn && (
                        <div className="comment-actions">
                            <button onClick={() => {
                                setEditCommentId(comment._id);
                                setEditCommentText(comment.text);
                            }}>Edit</button>
                            <button onClick={() => handleRemoveComment(comment._id)}>Remove</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Comment;
