import React from 'react';
import { Modal } from 'antd';
import './ImageViewerModal.css';

const ImageViewerModal = ({ isOpen, onClose, imageUrl, title }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="90vw"
      centered
      className="image-viewer-modal"
      title={title}
    >
      <div className="image-viewer-wrapper">
        <img 
          src={imageUrl} 
          alt={title}
          className="fullscreen-image"
        />
      </div>
    </Modal>
  );
};

export default ImageViewerModal;