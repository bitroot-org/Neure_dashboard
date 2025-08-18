import React from "react";
import { Typography } from "antd";
import { useLocation } from "react-router-dom";
import CustomHeader from "../../components/CustomHeader";

const { Text } = Typography;

const Article = () => {
  const { state } = useLocation();
  const article = state?.article;
  if (!article) return <div>No Article Data was provided.</div>;

  const { title, created_at, reading_time, image_url, content } = article;
  const formattedDate = new Date(created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  return (
    <div className="w-full min-h-screen px-5 sm:px-10 lg:px-20 py-10 flex flex-col items-center justify-center bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)]">
      <CustomHeader title="Article" showBackButton />
      <div className="w-full max-w-[1200px] min-h-screen mx-auto overflow-hidden px-5 bg-transparent">
        <div className="h-[500px] w-full rounded-[18px] bg-cover bg-center" style={{ backgroundImage: `url(${image_url})` }} />
        <div className="flex flex-col">
          <h1 className="m-0 py-2 text-5xl font-bold text-white">{title}</h1>
          <div className="flex items-center text-white/60 text-lg">
            <p className="m-0">{formattedDate}</p>
            <p className="mx-2">•</p>
            <p className="m-0">{reading_time} min read</p>
          </div>
          {content && <Text className="mt-2 text-base leading-relaxed text-[#d1d1d1]">{content}</Text>}
        </div>
      </div>
    </div>
  );
};

export default Article;

