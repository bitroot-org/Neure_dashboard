import React from "react";
import { Typography } from "antd";
import { useLocation } from "react-router-dom";
import "./Articles.css";
import CustomHeader from "../../components/CustomHeader";

const { Text, Title } = Typography;

const Article = () => {
  const { state } = useLocation();
  const article = state?.article;

  if (!article) {
    return <div>No Article Data was provided.</div>;
  }

  const { title, created_at, reading_time, image_url, content } = article;
  const formattedDate = new Date(created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
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
          <h1 className="blog-card__title">
            {title}
          </h1>

          <div className="blog-card__meta">
            <p className="blog-card_date">{formattedDate}</p>
            <p className="blog-card__dot">
              •
            </p>
            <p>{reading_time} min read</p>
          </div>

          {content && (
            <Text className="blog-card__excerpt">
              {content}
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;