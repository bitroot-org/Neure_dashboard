import React, { useState, useEffect } from "react";
import { Row, Col, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomHeader from "../../components/CustomHeader";
import CustomPagination from "../../components/CustomPagination";
import ArticleCard from "../../components/ArticleCard";
import { getArticles } from "../../services/api";
import Gallery from "../../components/Gallery";
import ArticleModal from "../../components/ArticleModal";

const ArticleShimmer = () => (
  <div className="relative h-[280px] w-full overflow-hidden rounded-[14px] bg-[#2d2f39]">
    <div
      className="absolute inset-0 animate-shimmer bg-[length:200%_100%]"
      style={{
        backgroundImage:
          "linear-gradient(90deg, #2d2f39 0%, #363845 50%, #2d2f39 100%)",
      }}
    />
    <div className="absolute bottom-5 left-5 right-5">
      <div className="mb-3 h-6 w-[70%] rounded bg-[#363845]" />
      <div className="h-4 w-[40%] rounded bg-[#363845]" />
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5,
    },
  },
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
      state: { article },
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
        const response = await getArticles({ currentPage });

        await new Promise((resolve) => setTimeout(resolve, 800));

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

  const tabButtonClass = (isActive) =>
    `px-4 py-3 text-base font-medium outline-none border-b-2 transition-colors ${
      isActive
        ? "text-white border-white"
        : "text-gray-400 border-transparent hover:text-white"
    }`;

  return (
    <div className="min-h-screen px-5 sm:px-10 lg:px-20 py-10 bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)]">
      <CustomHeader title="Resources" showBackButton={true} />

      <div className="mb-6 flex border-b border-gray-600">
        <button
          className={tabButtonClass(activeTab === "articles")}
          onClick={() => setActiveTab("articles")}
        >
          Articles
        </button>
        <button
          className={tabButtonClass(activeTab === "gallery")}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery
        </button>
        <button
          className={tabButtonClass(activeTab === "tools")}
          onClick={() => setActiveTab("tools")}
        >
          Tools
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === "articles" ? (
          <div>
            {loading ? (
              <Row gutter={[24, 24]}>
                {[...Array(6)].map((_, index) => (
                  <Col xs={24} sm={12} lg={8} key={`shimmer-${index}`}>
                    <ArticleShimmer />
                  </Col>
                ))}
              </Row>
            ) : error ? (
              <Alert message={error} type="warning" showIcon />
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <Row gutter={[24, 24]}>
                  {articles.map((article) => (
                    <Col xs={24} sm={12} lg={8} key={article.id}>
                      <motion.div variants={itemVariants}>
                        <div onClick={() => handleArticleClick(article)} style={{ cursor: "pointer" }}>
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
          <div className="flex max-w-[600px] flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 py-12 text-center sm:px-8 lg:mx-auto lg:my-10">
            <div className="mb-6 rounded-full bg-white/10 p-5 animate-pulse">
              <svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 8V12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 16H12.01" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mb-4 text-[28px] font-semibold text-white">Tools Coming Soon</h2>
            <p className="mb-8 max-w-[450px] text-base leading-relaxed text-[#B1B3C0]">
              We're working on building powerful tools to enhance your experience. Check back soon for updates!
            </p>
            <button
              className="rounded-lg bg-gradient-to-r from-white to-gray-200 px-6 py-3 text-base font-medium text-[#191a20] shadow-[0_4px_12px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(255,255,255,0.3)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(0,216,133,0.3)]"
              onClick={() => setActiveTab("articles")}
            >
              Explore Articles Instead
            </button>
          </div>
        ) : (
          <div>
            <Gallery />
          </div>
        )}
      </div>

      <ArticleModal isOpen={isModalOpen} onClose={handleModalClose} article={selectedArticle} />
    </div>
  );
};

export default Resources;

