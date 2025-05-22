import React, { useState, useEffect } from "react";
import { Row, Col, Alert, Empty } from "antd"; // Remove Spin from imports
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import CustomPagination from "../../components/CustomPagination";
import ArticleCard from "../../components/ArticleCard";
import { getArticles } from "../../services/api";
import Gallery from '../../components/Gallery/Gallery';
import { ToolOutlined } from '@ant-design/icons';
import ArticleModal from "../../components/ArticleModal/ArticleModal";


const ArticleShimmer = () => (
  <div className="article-shimmer">
    <div className="shimmer-wrapper">
      <div className="shimmer-background" />
      <div className="shimmer-content">
        <div className="shimmer-title" />
        <div className="shimmer-text" />
      </div>
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5
    }
  }
};

const Resources = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const navigate = useNavigate();

  const handleArticleClick = (article) => {
    navigate(`/articleDetails/${article.id}`, { 
      state: { article } // Pass the article data through navigation state
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getArticles({
          currentPage: currentPage,
        });

        // Add minimum loading time of 1.5 seconds
        await new Promise(resolve => setTimeout(resolve, 800));

        if (response.status && response.data.articles.length > 0) {
          setArticles(response.data.articles);
          setTotalPages(response.data.pagination.totalPages);
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
  }, [currentPage, activeTab]);

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
          className={`custom-tab ${activeTab === "gallery" ? "active" : ""}`}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery
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
              <Row gutter={[24, 24]}>
                {[...Array(6)].map((_, index) => (
                  <Col xs={24} sm={12} lg={8} key={`shimmer-${index}`}>
                    <ArticleShimmer />
                  </Col>
                ))}
              </Row>
            )  : error ? (
              <Alert message={error} type="warning" showIcon />
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Row gutter={[24, 24]}>
                  {articles.map((article, index) => (
                    <Col xs={24} sm={12} lg={8} key={article.id}>
                      <motion.div
                        className="article-grid-item"
                        variants={itemVariants}
                        style={{ "--item-index": index }}
                      >
                        <div
                          className="clickable-article"
                          onClick={() => handleArticleClick(article)}
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
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            )}
             {!loading && !error && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        ) : activeTab === "tools" ? (
          <div className="scrollable-content">
            <div className="tools-coming-soon">
              <div className="coming-soon-icon">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16H12.01" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="coming-soon-title">Tools Coming Soon</h2>
              <p className="coming-soon-description">
                We're working on building powerful tools to enhance your experience.
                Check back soon for updates!
              </p>
              <button 
                className="coming-soon-button"
                onClick={() => setActiveTab("articles")}
              >
                Explore Articles Instead
              </button>
            </div>
          </div>
        ) : (
          <div className="scrollable-content">
            <Gallery />
          </div>
        )}
      </div>
      <ArticleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        article={selectedArticle}
      />
    </div>
  );
};

export default Resources;
