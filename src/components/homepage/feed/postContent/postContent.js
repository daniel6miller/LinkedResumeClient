import React, { useState } from "react";
import './postContent.css';

function PostContent({ text }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Split the text into lines
  const lines = text.split('\n');
  
  // Determine whether the "See More" button should be shown
  const shouldShowSeeMore = lines.length > 4;

  // Handle the "See More" button click
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="post-content">
      {isExpanded ? (
        // Render full text
        <p>
          {lines.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      ) : (
        // Render first four lines
        <p>
          {lines.slice(0, 4).map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
          {shouldShowSeeMore && (
            <span>...</span> // Indicate there's more text
          )}
        </p>
      )}
      {shouldShowSeeMore && (
        <button onClick={toggleExpanded} className="see-more-button">
          {isExpanded ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
}

export default PostContent;
