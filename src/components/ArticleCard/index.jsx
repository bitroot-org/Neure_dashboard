import React from 'react';
import './ArticleCard.css';

const ArticleCard = ({ title, date, readingTime, backgroundImage }) => {
  return (
    <div className="article-card">
      <div 
        className="article-card__image" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="article-card__content">
        <h2 className="article-card__title">{title}</h2>
        <div className="article-card__meta">
          <span className="article-card__date">{date}</span>
          <span className="article-card__dot">•</span>
          <span className="article-card__reading-time">{readingTime}min read</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;