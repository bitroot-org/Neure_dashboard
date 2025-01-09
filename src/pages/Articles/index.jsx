import React from 'react';
import { Row, Col } from 'antd';
import './index.css';
import BackButton from '../../components/Button';
import { articles } from "../../constants/faqData";
import PresentationSlide from '../../components/PresentationSlide';
import CustomHeader from '../../components/CustomHeader';

const Article = () => {
  return (
    <div className="article-section">
      <CustomHeader title="Articles" showBackButton={true} />
      <div className="scrollable-content">
        <Row gutter={[16, 16]}>
          {articles.map(article => (
            <Col xs={24} sm={12} lg={8} key={article.id}>
              <PresentationSlide
                title={article.title}
                date={article.date}
                backgroundImage={article.imageUrl}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Article;