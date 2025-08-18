import React from 'react';
import { Modal } from 'antd';

const ArticleModal = ({ isOpen, onClose, article }) => {
  if (!article) return null;

  const formattedDate = new Date(article.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      className="[&_.ant-modal-content]:rounded-[20px] [&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-[#1f1f1f] [&_.ant-modal-close]:top-4 [&_.ant-modal-close]:right-4 [&_.ant-modal-close]:text-white [&_.ant-modal-close]:bg-black/50 [&_.ant-modal-close]:rounded-full [&_.ant-modal-close]:p-1"
      centered
    >
      <div>
        <div 
          className="w-full h-[300px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${article.image_url})` }}
        />
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{article.title}</h1>
          
          <div className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 text-sm">
            <span>{formattedDate}</span>
            <span className="text-gray-600 dark:text-gray-400">•</span>
            <span>
              {article.reading_time} min read
            </span>
          </div>

          <div className="text-gray-900 dark:text-gray-300 leading-relaxed text-base">
            {article.content}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ArticleModal;
