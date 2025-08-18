import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import VideoPlayerModal from './VideoPlayerModal';
import ImageViewerModal from './ImageViewerModal';
import { Row, Col, Dropdown, Space, message, Modal } from 'antd';
import { DownOutlined, FileImageOutlined, VideoCameraOutlined, FileOutlined, PlayCircleFilled } from '@ant-design/icons';
import { getGalleryItems, getMediaCounts , trackResourceView } from '../services/api';
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
      <div className="bg-transparent rounded-[20px] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
        <div
          className="relative w-full h-[200px] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          style={type === 'video' ? { backgroundColor: '#191A20' } : {}}
          onClick={handlePlayClick}
        >
          {type === 'video' ? (
            <div className="w-full h-full flex items-center justify-center">
              <PlayCircleFilled className="text-5xl text-white/50" />
            </div>
          ) : (
            <img src={image} alt={title} className="w-full h-full object-cover border border-white/[0.134] rounded-2xl" />
          )}
          {type === 'video' && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <PlayCircleFilled className="text-6xl text-white" />
            </div>
          )}
        </div>
        <div className="p-3">
          <h4 className="text-white text-sm font-medium mb-1 truncate">{getImageName(type === 'video' ? videoUrl : image)}</h4>
          <p className="text-white/60 text-xs">{date} • {formatSize(size)}</p>
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
      <div className="flex items-center p-4 bg-[#2d2f39] rounded-lg mb-2 hover:bg-[#363845] transition-colors duration-200">
        <div className="w-12 text-center text-white/70 text-sm">{srNo}</div>
        <div className="w-12 flex justify-center">
          <img src={getIcon(type)} alt={type} className="w-6 h-6" />
        </div>
        <div className="flex-1 text-white text-sm truncate px-4">{fileName}</div>
        <div className="w-20 text-white/70 text-sm text-center">{size}</div>
        <div className="w-24 text-white/70 text-sm text-center">{date}</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors" onClick={handleView}>View</button>
          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors" onClick={handleDownload}>Download</button>
        </div>
      </div>

      {isViewerOpen && (
        <Modal
          open={isViewerOpen}
          onCancel={() => setIsViewerOpen(false)}
          width={1000}
          footer={null}
          className="[&_.ant-modal-content]:bg-[#191A20] [&_.ant-modal-header]:bg-transparent [&_.ant-modal-title]:text-white [&_.ant-modal-close]:text-white"
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
      <div className="flex items-center p-4 bg-[#2d2f39] rounded-lg mb-2">
        <div className="w-10 h-10 bg-[#363845] rounded mr-4 relative overflow-hidden">
          <div className="h-5 bg-gradient-to-r from-[#363845] via-[#404252] to-[#363845] bg-[length:200%_100%] rounded animate-shimmer w-4/5" />
        </div>
        <div className="flex-1 h-5 bg-[#363845] rounded mr-4 relative overflow-hidden">
          <div className="h-5 bg-gradient-to-r from-[#363845] via-[#404252] to-[#363845] bg-[length:200%_100%] rounded animate-shimmer w-4/5" />
        </div>
        <div className="w-20 h-5 bg-[#363845] rounded mr-4 relative overflow-hidden">
          <div className="h-5 bg-gradient-to-r from-[#363845] via-[#404252] to-[#363845] bg-[length:200%_100%] rounded animate-shimmer w-4/5" />
        </div>
        <div className="w-20 h-5 bg-[#363845] rounded mr-4 relative overflow-hidden">
          <div className="h-5 bg-gradient-to-r from-[#363845] via-[#404252] to-[#363845] bg-[length:200%_100%] rounded animate-shimmer w-4/5" />
        </div>
        <div className="flex gap-2">
          <div className="w-12 h-6 bg-[#363845] rounded relative overflow-hidden">
            <div className="h-6 bg-gradient-to-r from-[#363845] via-[#404252] to-[#363845] bg-[length:200%_100%] rounded animate-shimmer" />
          </div>
          <div className="w-16 h-6 bg-[#363845] rounded relative overflow-hidden">
            <div className="h-6 bg-gradient-to-r from-[#363845] via-[#404252] to-[#363845] bg-[length:200%_100%] rounded animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent rounded-[20px] overflow-hidden">
      <div className="w-full h-[200px] bg-[#2d2f39] rounded-2xl relative overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#2d2f39] via-[#363845] to-[#2d2f39] bg-[length:200%_100%] animate-shimmer" />
      </div>
      <div className="p-3">
        <div className="h-4 bg-[#2d2f39] rounded mb-2 relative overflow-hidden">
          <div className="h-4 bg-gradient-to-r from-[#2d2f39] via-[#363845] to-[#2d2f39] bg-[length:200%_100%] rounded animate-shimmer w-3/4" />
        </div>
        <div className="h-3 bg-[#2d2f39] rounded relative overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-[#2d2f39] via-[#363845] to-[#2d2f39] bg-[length:200%_100%] rounded animate-shimmer w-1/2" />
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
      setLoading(true); // Set loading to true at the start
      console.log("Fetching gallery items for type:", activeType);
      
      const response = await getGalleryItems({
        type: activeType,
        page: pagination.currentPage
      });

      if (response.status) {
        console.log("Gallery items fetched successfully:", response.data);
        setGalleryItems(response.data.items);
        setPagination(response.data.pagination);
      } else {
        console.error("Failed to fetch gallery items:", response.error);
        message.error(response.error || 'Failed to fetch gallery items');
      }
    } catch (error) {
      console.error('An error occurred while fetching gallery items:', error);
      message.error('An error occurred while fetching gallery items');
    } finally {
      // Add a small delay to make the shimmer effect visible
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const renderGalleryItems = () => {
    if (loading) {
      return activeType === 'document' ? (
        <div className="w-full">
          <div className="flex items-center p-4 bg-[#191A20] border-b border-[#2D2F39] text-white/70 text-sm font-medium">
            <div className="w-12 text-center">Sr no.</div>
            <div className="w-12 text-center">Type</div>
            <div className="flex-1 px-4">File name</div>
            <div className="w-20 text-center">Size</div>
            <div className="w-24 text-center">Date</div>
            <div className="w-32 text-center">Action</div>
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
        <div className="w-full">
          <div className="flex items-center p-4 bg-[#191A20] border-b border-[#2D2F39] text-white/70 text-sm font-medium">
            <div className="w-12 text-center">Sr no.</div>
            <div className="w-12 text-center">Type</div>
            <div className="flex-1 px-4">File name</div>
            <div className="w-20 text-center">Size</div>
            <div className="w-24 text-center">Date</div>
            <div className="w-32 text-center">Action</div>
          </div>
          {galleryItems.map((item, index) => {
            const fileName = item.file_url.split('/').pop();
            const fileType = fileName.split('.').pop();
            return (
              <motion.div
                key={item.id}
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
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button
            className={`flex items-center h-12 gap-2 px-4 py-2 bg-[#191A20] border border-[#2D2F39] rounded-[50px] text-[#B1B3C0] cursor-pointer transition-all duration-300 text-base font-medium hover:border-[#4B5563] ${
              activeType === 'image' ? 'bg-[#2D2F39] text-white border-[#4B5563]' : ''
            }`}
            onClick={() => setActiveType('image')}
          >
            <FileImageOutlined /> Images ({mediaCounts.image})
          </button>
          <button
            className={`flex items-center h-12 gap-2 px-4 py-2 bg-[#191A20] border border-[#2D2F39] rounded-[50px] text-[#B1B3C0] cursor-pointer transition-all duration-300 text-base font-medium hover:border-[#4B5563] ${
              activeType === 'video' ? 'bg-[#2D2F39] text-white border-[#4B5563]' : ''
            }`}
            onClick={() => setActiveType('video')}
          >
            <VideoCameraOutlined /> Video ({mediaCounts.video})
          </button>
          <button
            className={`flex items-center h-12 gap-2 px-4 py-2 bg-[#191A20] border border-[#2D2F39] rounded-[50px] text-[#B1B3C0] cursor-pointer transition-all duration-300 text-base font-medium hover:border-[#4B5563] ${
              activeType === 'document' ? 'bg-[#2D2F39] text-white border-[#4B5563]' : ''
            }`}
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
            <button className="px-4 py-2 bg-[#191A20] border border-[#2D2F39] rounded-lg text-white cursor-pointer">
              <Space>Sort by<DownOutlined /></Space>
            </button>
          </Dropdown>
        )}
      </div>

      <div>
        {renderGalleryItems()}
      </div>
    </div>
  );
};

export default Gallery;
