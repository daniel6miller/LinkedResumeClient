// DocumentEditor.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocLayout from './docLayout/docLayout';
import DocToolbar from './docToolbar/docToolbar';
import CommentBox from './commentBox';
import CommentList from './commentList';
import './documentEditor.css';

function DocumentEditor() {
    const { documentId } = useParams();
    const userSignedIn = sessionStorage.getItem('_id');
    const [documentData, setDocumentData] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [selectedHighlight, setSelectedHighlight] = useState(null);
    const [isHighlighting, setIsHighlighting] = useState(false);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [highlightPosition, setHighlightPosition] = useState(null);
    const [highlights, setHighlights] = useState([]);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/document/${documentId}`);
                if (!response.ok) throw new Error('Document fetch failed');
                
                const data = await response.json();
                setDocumentData(data);
                setComments(data.comments || []);
                setHighlights(data.highlights || []);
            } catch (error) {
                console.error('Failed to fetch document:', error);
            }
        };

        if (documentId) {
            fetchDocument();
        }
    }, [documentId]);

    useEffect(() => {
        if (isHighlighting) {
            document.addEventListener('mouseup', handleTextSelection);
        } else {
            document.removeEventListener('mouseup', handleTextSelection);
        }

        return () => {
            document.removeEventListener('mouseup', handleTextSelection);
        };
    }, [isHighlighting]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const commentData = {
            text: newComment,
            userId: userSignedIn
        };

        if (selectedHighlight) {
            commentData.highlightId = selectedHighlight.id;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/document/${documentId}/addComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });
            if (!response.ok) throw new Error('Failed to add comment');

            const addedComment = await response.json();
            setComments([...comments, addedComment]);
            setNewComment('');
            setShowCommentBox(false); // Hide the comment box
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleHighlight = () => {
        setIsHighlighting(!isHighlighting);
    };

    const handleTextSelection = async () => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const text = selection.toString();
        if (!text.trim()) return;

        // Ensure the range is valid
        if (!range.startContainer || !range.endContainer) return;

        // Clear selection
        selection.removeAllRanges();

        // Get the bounding rectangle of the range
        const rect = range.getBoundingClientRect();

        // Create a highlight object
        const newHighlight = {
            id: new Date().getTime().toString(), // Simple unique ID
            content: text,
            highlightAreas: [
                {
                    left: rect.left + window.scrollX,
                    top: rect.top + window.scrollY,
                    width: rect.width,
                    height: rect.height,
                }
            ]
        };

        // Save the highlight to the backend
        await saveHighlight(newHighlight);

        // Set the position of the highlight button
        setHighlightPosition({
            left: window.innerWidth - 150, // Position to the far right
            top: rect.top + window.scrollY,
        });

        // Add the highlight to the state
        setHighlights([...highlights, newHighlight]);
        setSelectedHighlight(newHighlight);
    };

    const saveHighlight = async (highlight) => {
        try {
            await fetch(`http://localhost:8080/api/document/${documentId}/addHighlight`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ highlight })
            });
        } catch (error) {
            console.error('Failed to save highlight:', error);
        }
    };

    const handleEditComment = async (commentId, newText) => {
        try {
            const response = await fetch(`http://localhost:8080/api/document/${documentId}/editComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commentId, text: newText })
            });
            if (!response.ok) throw new Error('Failed to edit comment');

            const updatedDocument = await response.json();
            setComments(updatedDocument.comments);
            setEditCommentId(null);
            setEditCommentText('');
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Failed to edit comment:', error);
        }
    };

    const handleRemoveComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/document/${documentId}/removeComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commentId })
            });
            if (!response.ok) throw new Error('Failed to remove comment');

            const updatedDocument = await response.json();
            setComments(updatedDocument.comments);
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Failed to remove comment:', error);
        }
    };

    if (!documentData) {
        return <div>Loading...</div>;
    }

    const createdBy = `${documentData.createdBy.firstName} ${documentData.createdBy.lastName}`;
    const title = `${documentData.title}`;

    return (
        <div className="documentEditor">
            <DocLayout author={createdBy} title={title}>
                <DocToolbar onHighlight={handleHighlight} onAddComment={() => setShowCommentBox(true)} />
                <div className='wrapper'>
                    <div className="document-viewer">

                    </div>
                    <div className="document-comments">
                        {highlightPosition && (
                            <button
                                className="highlight-button"
                                onClick={() => setShowCommentBox(true)}
                            >
                                Comment
                            </button>
                        )}
                        {showCommentBox && (
                            <CommentBox
                                newComment={newComment}
                                setNewComment={setNewComment}
                                handleAddComment={handleAddComment}
                            />
                        )}
                        <CommentList
                            comments={comments}
                            editCommentId={editCommentId}
                            editCommentText={editCommentText}
                            setEditCommentText={setEditCommentText}
                            handleEditComment={handleEditComment}
                            handleRemoveComment={handleRemoveComment}
                            setEditCommentId={setEditCommentId}
                            userSignedIn={userSignedIn}
                        />
                    </div>
                </div>
            </DocLayout>
        </div>
    );
}

export default DocumentEditor;
