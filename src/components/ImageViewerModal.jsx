import React from 'react';
import { Modal } from 'antd';

const ImageViewerModal = ({ isOpen, onClose, imageUrl, title }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="90vw"
      centered
      className="[&_.ant-modal-content]:bg-[rgba(25,26,32,0.95)] [&_.ant-modal-content]:backdrop-blur-[10px] [&_.ant-modal-header]:bg-transparent [&_.ant-modal-header]:border-b-0 [&_.ant-modal-title]:text-white [&_.ant-modal-close]:text-white"
      title={title}
    >
      <div className="flex justify-center items-center min-h-[60vh]">
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-[80vh] object-contain hover:cursor-zoom-in"
        />
      </div>
    </Modal>
  );
};

export default ImageViewerModal;