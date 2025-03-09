import React from 'react';
import './docToolbar.css';

function DocToolbar({ onHighlight, onAddComment }) {
    return (
        <div className="ToolBar">
            <button onClick={onHighlight}>Highlight Text</button>
            <button onClick={onAddComment}>Add Comment</button>
        </div>
    );
}

export default DocToolbar;

