import React from 'react';
import { Modal } from 'antd';
import ReactPlayer from 'react-player';

const VideoPlayerModal = ({ isOpen, onClose, videoUrl, title }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="[&_.ant-modal-content]:bg-[#191A20] [&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:p-0 [&_.ant-modal-header]:bg-transparent [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-[#2D2F39] [&_.ant-modal-header]:px-6 [&_.ant-modal-header]:py-4 [&_.ant-modal-title]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-body]:p-0"
      title={title}
    >
      <div className="relative pt-[56.25%] [&>div]:absolute [&>div]:top-0 [&>div]:left-0">
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="100%"
          playing
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload'
              }
            }
          }}
        />
      </div>
    </Modal>
  );
};

export default VideoPlayerModal;