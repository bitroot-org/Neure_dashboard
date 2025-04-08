import React from "react";
import { useLocation } from "react-router-dom";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "./Articles.css";
import CustomHeader from "../../components/CustomHeader";

const Article = () => {
  const { state } = useLocation();
  const article = state?.article;

  if (!article) {
    return (
      <div className="article-details">
        <CustomHeader title="Article" showBackButton={true} />
        <div className="no-article-message">
          <h2>No Article Data Available</h2>
          <p>The article you're looking for could not be found or was not provided.</p>
        </div>
      </div>
    );
  }

  const { title, created_at, reading_time, image_url, content } = article;
  const formattedDate = new Date(created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="article-details">
      <CustomHeader title="Article" showBackButton={true} />
      <div className="blog-card">
        <div
          className="blog-card__image-container"
          style={{ backgroundImage: `url(${image_url})` }}
        />
        <div className="blog-card__content">
          <h1 className="blog-card__title">{title}</h1>

          <div className="blog-card__meta">
            <div className="blog-card__meta-item">
              <CalendarOutlined /> <span>{formattedDate}</span>
            </div>
            <div className="blog-card__dot">•</div>
            <div className="blog-card__meta-item">
              <ClockCircleOutlined /> <span>{reading_time} min read</span>
            </div>
          </div>

          {content && (
            <div className="blog-card__excerpt">
              {content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;