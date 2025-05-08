import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import VideoPlayerModal from '../VideoPlayerModal/VideoPlayerModal';
import ImageViewerModal from '../ImageViewerModal/ImageViewerModal';
import { Row, Col, Dropdown, Space, message, Modal } from 'antd';
import { DownOutlined, FileImageOutlined, VideoCameraOutlined, FileOutlined, PlayCircleFilled } from '@ant-design/icons';
import './Gallery.css';
import { getGalleryItems, getMediaCounts , trackResourceView } from '../../services/api';
import { motion } from 'framer-motion';

// Components
const GalleryCard = ({ type, image, title, date, size, videoUrl, id }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const getImageName = (url) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const handlePlayClick = async (e) => {
    e.preventDefault();
    
    try {
      // Track resource view based on type
      const resourceType = type === 'video' ? 'gallery_video' : 'gallery_image';
      await trackResourceView(id, resourceType);
      
      if (type === 'video') {
        setIsVideoModalOpen(true);
      } else {
        setIsImageModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to track resource view:', error);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Add this function inside GalleryCard component
  const getRandomColor = () => {
    const colors = [
      '#2D2F39', // Dark gray
      '#2C3E50', // Navy blue
      '#34495E', // Dark slate
      '#2E4053', // Midnight blue
      '#283747'  // Charcoal
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <div className="gallery-card">
        <div
          className="gallery-card-media"
          style={type === 'video' ? { backgroundColor: '#191A20' } : {}}
          onClick={handlePlayClick}
        >
          {type === 'video' ? (
            <div className="video-placeholder">
              <PlayCircleFilled />
            </div>
          ) : (
            <img src={image} alt={title} />
          )}
          {type === 'video' && (
            <div className="play-button-overlay">
              <PlayCircleFilled />
            </div>
          )}
        </div>
        <div className="gallery-card-info">
          <h4>{getImageName(type === 'video' ? videoUrl : image)}</h4>
          <p>{date} • {formatSize(size)}</p>
        </div>
      </div>

      {/* Video Modal */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={videoUrl}
        title={getImageName(videoUrl)}
      />

      {/* Image Modal */}
      <ImageViewerModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={image}
        title={getImageName(image)}
      />
    </>
  );
};

const DocumentRow = ({ srNo, type, fileName, size, date, fileUrl, id }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const getIcon = (type) => {
    const icons = {
      pdf: '/FilePdf.svg',
      doc: '/FileDoc.svg',
      ppt: '/FilePpt.svg'
    };
    return icons[type.toLowerCase()] || '/FileDoc.svg';
  };

  const handleDownload = async () => {
    try {
      await trackResourceView(id, 'gallery_document'); // Fixed: passing parameters directly
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Failed to track document download:', error);
      message.error('Failed to download file');
    }
  };

  const handleView = async () => {
    try {
      await trackResourceView(id, 'gallery_document'); // Fixed: passing parameters directly
      setIsViewerOpen(true);
    } catch (error) {
      console.error('Failed to track document view:', error);
    }
  };

  return (
    <>
      <div className="document-row">
        <div className="sr-no">{srNo}</div>
        <div className="doc-type">
          <img src={getIcon(type)} alt={type} />
        </div>
        <div className="file-name">{fileName}</div>
        <div className="file-size">{size}</div>
        <div className="file-date">{date}</div>
        <div className="file-actions">
          <button className="action-btn view" onClick={handleView}>View</button>
          <button className="action-btn download" onClick={handleDownload}>Download</button>
        </div>
      </div>

      {isViewerOpen && (
        <Modal
          open={isViewerOpen}
          onCancel={() => setIsViewerOpen(false)}
          width={1000}
          footer={null}
          className="document-viewer-modal"
        >
          <iframe
            src={fileUrl}
            title={fileName}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        </Modal>
      )}
    </>
  );
};

const GalleryShimmer = ({ type }) => {
  if (type === 'document') {
    return (
      <div className="document-row-shimmer">
        <div className="doc-type-shimmer">
          <div className="shimmer-animation" />
        </div>
        <div className="file-name-shimmer">
          <div className="shimmer-animation" />
        </div>
        <div className="file-meta-shimmer">
          <div className="shimmer-animation" />
        </div>
        <div className="file-meta-shimmer">
          <div className="shimmer-animation" />
        </div>
        <div className="file-actions-shimmer">
          <div className="action-shimmer">
            <div className="shimmer-animation" />
          </div>
          <div className="action-shimmer">
            <div className="shimmer-animation" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-shimmer">
      <div className="gallery-shimmer-media">
        <div className="shimmer-animation" />
      </div>
      <div className="gallery-shimmer-info">
        <div className="gallery-shimmer-title">
          <div className="shimmer-animation" />
        </div>
        <div className="gallery-shimmer-meta">
          <div className="shimmer-animation" />
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [activeType, setActiveType] = useState('image');
  const [loading, setLoading] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [mediaCounts, setMediaCounts] = useState({ image: 0, video: 0, document: 0 });
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchGalleryItems();
  }, [activeType]);

  useEffect(() => {
    fetchMediaCounts();
  }, []);

  const fetchMediaCounts = async () => {
    try {
      const response = await getMediaCounts(1); // Replace with actual company ID
      if (response.status) {
        setMediaCounts(response.data);
      }
    } catch (error) {
      message.error('Failed to fetch media counts');
    }
  };

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await getGalleryItems({
        type: activeType,
        page: pagination.currentPage
      });

      if (response.status) {
        setGalleryItems(response.data.items);
        setPagination(response.data.pagination);
      } else {
        message.error(response.error || 'Failed to fetch gallery items');
      }
    } catch (error) {
      message.error('An error occurred while fetching gallery items');
    } finally {
      setLoading(false);
    }
  };

  const renderGalleryItems = () => {
    if (loading) {
      return activeType === 'document' ? (
        <div className="documents-container">
          <div className="document-header">
            <div className="sr-no">Sr no.</div>
            <div className="doc-type">Type</div>
            <div className="file-name">File name</div>
            <div className="file-size">Size</div>
            <div className="file-date">Date</div>
            <div className="file-actions">Action</div>
          </div>
          {[...Array(5)].map((_, index) => (
            <GalleryShimmer key={index} type="document" />
          ))}
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {[...Array(8)].map((_, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={`shimmer-${index}`}>
              <GalleryShimmer type={activeType} />
            </Col>
          ))}
        </Row>
      );
    }

    if (activeType === 'document') {
      return (
        <div className="documents-container">
          <div className="document-header">
            <div className="sr-no">Sr no.</div>
            <div className="doc-type">Type</div>
            <div className="file-name">File name</div>
            <div className="file-size">Size</div>
            <div className="file-date">Date</div>
            <div className="file-actions">Action</div>
          </div>
          {galleryItems.map((item, index) => {
            const fileName = item.file_url.split('/').pop();
            const fileType = fileName.split('.').pop();
            return (
              <motion.div
                key={item.id}
                className="gallery-grid-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DocumentRow
                  id={item.id}
                  srNo={index + 1}
                  type={fileType}
                  fileName={fileName}
                  fileUrl={item.file_url}
                  size={formatSize(item.size)}
                  date={new Date(item.created_at).toLocaleDateString()}
                />
              </motion.div>
            );
          })}
        </div>
      );
    }

    return (
      <Row gutter={[24, 24]}>
        {galleryItems.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <motion.div
              className="gallery-grid-item"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <GalleryCard
                id={item.id}
                type={item.file_type}
                image={item.file_url}
                videoUrl={item.file_url}
                date={new Date(item.created_at).toLocaleDateString()}
                size={item.size}
              />
            </motion.div>
          </Col>
        ))}
      </Row>
    );
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <div className="gallery-filters">
          <button
            className={`filter-btn ${activeType === 'image' ? 'active' : ''}`}
            onClick={() => setActiveType('image')}
          >
            <FileImageOutlined /> Images ({mediaCounts.image})
          </button>
          <button
            className={`filter-btn ${activeType === 'video' ? 'active' : ''}`}
            onClick={() => setActiveType('video')}
          >
            <VideoCameraOutlined /> Video ({mediaCounts.video})
          </button>
          <button
            className={`filter-btn ${activeType === 'document' ? 'active' : ''}`}
            onClick={() => setActiveType('document')}
          >
            <FileOutlined /> Documents ({mediaCounts.document})
          </button>
        </div>
        {activeType === 'document' && (
          <Dropdown menu={{
            items: [
              { key: 'newest', label: 'Newest First' },
              { key: 'oldest', label: 'Oldest First' },
              { key: 'name', label: 'Name (A-Z)' }
            ],
            onClick: (e) => console.log('Sort by:', e.key)
          }}>
            <button className="sort-btn">
              <Space>Sort by<DownOutlined /></Space>
            </button>
          </Dropdown>
        )}
      </div>

      <div className="gallery-content">
        {loading ? (
          <div className="loading-container">Loading...</div>
        ) : (
          renderGalleryItems()
        )}
      </div>
    </div>
  );
};

export default Gallery;
