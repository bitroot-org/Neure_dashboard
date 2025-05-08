import React from 'react';
import { Modal } from 'antd';
import ReactPlayer from 'react-player';
import './VideoPlayerModal.css';

const VideoPlayerModal = ({ isOpen, onClose, videoUrl, title }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="video-player-modal"
      title={title}
    >
      <div className="video-player-wrapper">
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