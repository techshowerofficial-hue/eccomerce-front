
import React, { useState } from "react";
import "./ReadMoreText.css";

const ReadMoreText = ({
  text = "",
  lines = 3,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const description = String(text || "").trim();

  if (!description) {
    return null;
  }

  return (
    <div className={`read-more-container ${className}`}>
      <p
        className={`read-more-text ${
          expanded ? "expanded" : "collapsed"
        }`}
        style={{
          "--description-lines": lines,
        }}
        ref={(element) => {
          if (element && !expanded) {
            setShowButton(
              element.scrollHeight > element.clientHeight + 1
            );
          }
        }}
      >
        {description}
      </p>

      {showButton && (
        <button
          type="button"
          className="read-more-button"
          onClick={() => setExpanded((previous) => !previous)}
        >
          {expanded ? "Less" : "More"}
        </button>
      )}
    </div>
  );
};

export default ReadMoreText;

