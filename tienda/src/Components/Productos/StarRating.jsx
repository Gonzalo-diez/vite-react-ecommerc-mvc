import React from 'react';
import { IoStar, IoStarOutline } from 'react-icons/io5';

const StarRating = ({ averageRating }) => {
  const renderStars = () => {
    const filledStars = Math.floor(averageRating);
    const remainder = averageRating % 1;

    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(<IoStar key={i} />);
    }

    if (remainder > 0) {
      stars.push(<IoStarOutline key="remainder" />);
    }

    return stars;
  };

  return (
    <div className="star-rating">
      {renderStars()}
      <span className="average">{averageRating.toFixed(2)}</span>
    </div>
  );
};

export default StarRating;