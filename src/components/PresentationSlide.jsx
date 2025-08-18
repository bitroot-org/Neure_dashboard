import React from "react";

// Tailwind-only PresentationSlide component
const PresentationSlide = ({ title, date, backgroundImage, endTime, isLoading }) => {
  const formatTime = (d) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const day = date ? new Date(date).getDate() : null;
  const month = date
    ? new Date(date).toLocaleString("en-US", { month: "short" }).toUpperCase()
    : null;
  const timeDisplay =
    date && endTime ? `${formatTime(date)} - ${formatTime(endTime)}` : date ? formatTime(date) : "";

  if (isLoading) {
    return (
      <div className="w-full min-h-[230px] h-full border border-[#585151] rounded-[14px] bg-[#2d2f39] overflow-hidden flex flex-col">
        <div className="h-[150px] w-full bg-gradient-to-r from-[#363845] via-[#404252] to-[#363845] bg-cover bg-center animate-pulse" />
        <div className="p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#404252] via-[#4a4c5c] to-[#404252] animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#404252] rounded w-3/5 animate-pulse" />
            <div className="h-3 bg-[#404252] rounded w-2/5 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!title) {
    return (
      <div className="w-full min-h-[230px] h-full border border-[#585151] rounded-[14px] bg-gradient-to-br from-[#2d2f39] to-[#252731] shadow-inner flex items-center justify-center overflow-hidden relative">
        <div className="w-full p-8 text-center  backdrop-blur-sm rounded-md">
          <h2 className="text-white text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#b3b3b3]">
            No Upcoming Workshop
          </h2>
          <p className="text-[#ffffff99] text-sm max-w-xs mx-auto">
            Book a workshop to unlock your learning journey
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[230px] h-full border border-[#585151] rounded-[14px] bg-[#2d2f39] overflow-hidden relative">
      {/* Background image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden
        />
      )}

      {/* Top subtle radial glow */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 400px 80px at 50% 0%, rgba(0,216,133,0.18) 0%, rgba(0,216,133,0.06) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 p-3 flex items-start gap-3">
        <div className="w-10 h-12 flex-shrink-0 border border-white rounded-md overflow-hidden flex flex-col">
          <div className="flex-1 flex items-center justify-center text-white text-sm font-medium">
            {day}
          </div>
          <div className="h-[40%] bg-white flex items-center justify-center text-xs font-medium text-black">
            {month}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-white text-base font-medium leading-6 truncate">{title}</h1>
          {timeDisplay && <p className="text-[#ffffffb3] text-sm mt-1">{timeDisplay}</p>}
        </div>
      </div>
    </div>
  );
};

export default PresentationSlide;
