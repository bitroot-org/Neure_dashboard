import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Alert } from "antd";
import "./index.css";
import PresentationSlide from "../../components/PresentationSlide";
import CustomPagination from "../../components/CustomPagination";
import ArticleCard from "../../components/ArticleCard";
import CustomHeader from "../../components/CustomHeader";
import axios from "axios";

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/article/articles`,
          {
            params: { page: currentPage },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status && response.data.data.articles.length > 0) {
          setArticles(response.data.data.articles);
          setTotalPages(response.data.data.pagination.totalPages);
        } else {
          setError("Oops! There are no articles to display.");
        }
      } catch (err) {
        setError("Failed to fetch articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="article-section">
      <CustomHeader title="Articles" showBackButton={true} />
      <div className="scrollable-content">
        {loading ? (
          <Spin tip="Loading articles..." />
        ) : error ? (
          <Alert message={error} type="warning" showIcon />
        ) : (
          <Row gutter={[16, 16]}>
            {articles.map((article) => (
              <Col xs={24} sm={12} lg={8} key={article.id}>
                <ArticleCard
                  title={article.title}
                  date={new Date(article.created_at).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    }
                  )}
                  readingTime={article.reading_time}
                  backgroundImage={article.image_url}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Article;
