import React, { useState } from 'react';

function StarRating({ movieTitle, currentRating, onRate }) {
  const [hover, setHover] = useState(0);

  return (
    <div 
      className="star-rating"
      onMouseLeave={() => setHover(0)} // Reset hover when mouse leaves the component
    >
      {[1, 2, 3, 4, 5].map(starValue => (
        <button
          key={starValue}
          className="star-button"
          onClick={() => onRate(movieTitle, starValue)}
          onMouseEnter={() => setHover(starValue)} // Set hover state on enter
        >
          <span 
            className="star" 
            style={{ color: starValue <= (hover || currentRating) ? '#fca311' : '#5c2c69' }}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export default StarRating;