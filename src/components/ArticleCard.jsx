import React from 'react';

const ArticleCard = ({ title, date, readingTime, backgroundImage }) => {
  return (
    <div className="w-full max-w-[600px] h-[280px] rounded-[18px] overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-[#282932] flex flex-col">
      <div
        className="w-full h-[170px] bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="p-3 bg-black flex-grow flex gap-1 flex-col justify-between">
        <h2 className="text-[1.4rem] font-normal leading-[1.2] text-white line-clamp-2 max-h-[3.4rem] overflow-hidden text-ellipsis">{title}</h2>
        <div className="flex items-center text-base text-white/70 font-normal mt-auto">
          <span className="mr-1">{date}</span>
          <span className="mx-2">•</span>
          <span className="ml-0">{readingTime}min read</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;