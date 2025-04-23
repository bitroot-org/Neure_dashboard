import React from 'react';
import { Modal } from 'antd';
import './ArticleModal.css';

const ArticleModal = ({ isOpen, onClose, article }) => {
  if (!article) return null;

  const formattedDate = new Date(article.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      className="article-modal"
      centered
    >
      <div className="article-modal-content">
        <div 
          className="article-modal-image"
          style={{ backgroundImage: `url(${article.image_url})` }}
        />
        <div className="article-modal-body">
          <h1 className="article-modal-title">{article.title}</h1>
          
          <div className="article-modal-meta">
            <span className="article-modal-date">{formattedDate}</span>
            <span className="article-modal-dot">•</span>
            <span className="article-modal-reading-time">
              {article.reading_time} min read
            </span>
          </div>

          <div className="article-modal-content-text">
            {article.content}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ArticleModal;