import React from 'react';
import './index.css';

const ArticleCard = ({ title, date,readingTime, backgroundImage }) => {
  return (
    <div className="slide">
      <div className="content">
        <h1>{title}</h1>
        <div><p>{date}  |  {readingTime} min read</p></div>
        
      </div>
      <div className="background">
        {backgroundImage && (
          <div 
            className="background-image" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
      </div>
    </div>
  );
};

export default ArticleCard;