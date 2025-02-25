import React, { useState, useEffect } from "react";
import { Row, Col, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import CustomPagination from "../../components/CustomPagination";
import ArticleCard from "../../components/ArticleCard";
import axios from "axios";

const Resources = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();


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
          setError(null);
        } else {
          setError("Oops! There are no articles to display.");
        }
      } catch (err) {
        setError("Failed to fetch articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === "articles") {
      fetchArticles();
    }
  }, [currentPage, token, activeTab]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="article-section">
      <CustomHeader title="Resources" showBackButton={true} />
      <div className="custom-tabs">
        <button
          className={`custom-tab ${activeTab === "articles" ? "active" : ""}`}
          onClick={() => setActiveTab("articles")}
        >
          Articles
        </button>
        <button
          className={`custom-tab ${activeTab === "tools" ? "active" : ""}`}
          onClick={() => setActiveTab("tools")}
        >
          Tools
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "articles" ? (
          <div className="scrollable-content">
            {loading ? (
              <Spin tip="Loading articles..." />
            ) : error ? (
              <Alert message={error} type="warning" showIcon />
            ) : (
              <Row gutter={[24, 24]}>
                {articles.map((article) => (
                  <Col xs={24} sm={12} lg={8} key={article.id}>
                    <div
                      className="clickable-article"
                      onClick={() =>
                        navigate(`/articleDetails/${article.id}`, {
                          state: { article },
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <ArticleCard
                        title={article.title}
                        date={new Date(article.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                        readingTime={article.reading_time}
                        backgroundImage={article.image_url}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            )}
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="scrollable-content">
            <p>tools content goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
