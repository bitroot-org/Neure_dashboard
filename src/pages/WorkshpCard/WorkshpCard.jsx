import React, { useState, useEffect } from "react";
import { Typography, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import CustomHeader from "../../components/CustomHeader";
import CheckInModal from "../../components/CheckInModal";
import AttendeeModal from "../../components/AttendeeModal";
import { getWorkshopDetails } from "../../services/api";

const { Title } = Typography;

const formatDateTime = (date, startTime, endTime) => {
  if (!startTime) return "";
  const formatDateFromString = (dateStr) => {
    if (!dateStr) return "";
    const datePart = dateStr.split(" ")[0];
    if (!datePart) return "";
    const [year, month, day] = datePart.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[parseInt(month, 10) - 1];
    const tempDate = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10));
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[tempDate.getDay()];
    return `${dayName}, ${monthName} ${parseInt(day, 10)}, ${year}`;
  };
  const formatTimeFromString = (timeStr) => {
    if (!timeStr) return "";
    const timePart = timeStr.split(" ")[1];
    if (!timePart) return "";
    const [hours, minutes] = timePart.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const displayHours = hourNum % 12 || 12;
    return `${displayHours}:${minutes} ${period}`;
  };
  const formattedDate = formatDateFromString(startTime);
  const formattedStartTime = formatTimeFromString(startTime);
  const formattedEndTime = endTime ? formatTimeFromString(endTime) : "";
  if (!formattedEndTime) return `${formattedDate} | ${formattedStartTime}`;
  return `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
};

const WorkshpCard = () => {
  const { workshopId } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [scheduleId, setScheduleId] = useState(null);

  const isWorkshopToday = () => {
    if (!workshop?.schedules?.[0]?.start_time) return false;
    const startTime = new Date(workshop.schedules[0].start_time);
    const today = new Date();
    return startTime.getDate() === today.getDate() && startTime.getMonth() === today.getMonth() && startTime.getFullYear() === today.getFullYear();
  };
  const isWorkshopCanceled = () => workshop?.schedules?.[0]?.status === "canceled";
  const getButtonsDisabled = () => !isWorkshopToday() || isWorkshopCanceled();
  const getButtonTooltip = () => (isWorkshopCanceled() ? "This workshop is yet to be held " : !isWorkshopToday() ? "These actions are only available on the day of the workshop" : "");
  const isWorkshopCompleted = () => workshop?.schedules?.[0]?.status === "completed";

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      const companyId = localStorage.getItem("companyId");
      try {
        setLoading(true);
        const scheduleIdParam = new URLSearchParams(window.location.search).get("scheduleId");
        const validScheduleId = scheduleIdParam || "";
        setScheduleId(validScheduleId);
        const response = await getWorkshopDetails(workshopId, companyId, validScheduleId);
        if (response.status) {
          setWorkshop(response.data);
          if (!validScheduleId && response.data.schedules && response.data.schedules.length > 0) {
            const firstScheduleId = response.data.schedules[0].schedule_id;
            setScheduleId(firstScheduleId);
            const newUrl = `${window.location.pathname}?scheduleId=${firstScheduleId}`;
            window.history.replaceState(null, "", newUrl);
          }
        } else {
          message.error("Failed to fetch workshop details");
        }
      } catch (error) {
        message.error("Error fetching workshop details");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshopDetails();
  }, [workshopId]);

  const handleDownload = () => {
    if (!isWorkshopCompleted()) {
      message.info("Worksheet will be available after the workshop is completed");
      return;
    }
    if (workshop?.pdf_url) window.open(workshop.pdf_url, "_blank");
    else message.error("PDF not available");
  };

  if (loading) return <Spin size="large" />;
  if (!workshop) return <div>Workshop not found</div>;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
      <CustomHeader
        title="Workshop Details"
        showAttendeeButtons
        onViewAttendeesClick={() => setShowAttendeeModal(true)}
        onCheckInClick={() => setIsCheckInModalOpen(true)}
        buttonDisabled={getButtonsDisabled()}
        buttonTooltip={getButtonTooltip()}
        workshopStatus={workshop?.schedules?.[0]?.status}
      />

      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto w-full rounded-2xl">
          <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-[#1a1a1a]">
            {workshop.poster_image ? (
              <img src={workshop.poster_image} alt="Workshop" className="h-[500px] w-full rounded-2xl object-cover brightness-90" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(45deg,_#2a2a2a,_#1a1a1a)] text-white/30">
                <div className="mb-4 text-6xl">🖼️</div>
                <div className="text-2xl font-medium text-white/20">No Image Available</div>
              </div>
            )}
          </div>

          <div className="py-8">
            <div className="border-b border-white/10 pb-6">
              <Title className="!m-0 !mb-3 !text-[40px] !font-medium !text-white md:!text-[32px] sm:!text-[24px]">
                {workshop.title}
              </Title>
              {workshop.schedules[0]?.host_name && (
                <p className="m-0 text-[20px] font-normal text-[#B1B3C0]">
                  By <span className="text-white">{workshop.schedules[0]?.host_name}</span>
                </p>
              )}
            </div>

            <div className="my-6 flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3 rounded-[18px] border border-white/10 px-4 py-3 text-white/85">
                <img src="/calendarIcon.png" alt="calendar-icon" className="h-5 w-5" />
                <h3 className="m-0 text-[20px] font-normal text-white">
                  {formatDateTime(workshop.conference_date, workshop.schedules[0]?.start_time, workshop.schedules[0]?.end_time)}
                </h3>
              </div>
              <button
                className={`h-12 rounded-[70px] px-6 text-base font-medium ${
                  !isWorkshopCompleted()
                    ? "cursor-not-allowed border border-[#d9d9d9] bg-gradient-to-b from-white to-[#9CA3AF] text-black/50 opacity-50"
                    : "bg-gradient-to-b from-white to-[#797B87] text-black"
                }`}
                onClick={handleDownload}
                disabled={!isWorkshopCompleted()}
              >
                Download worksheet
              </button>
            </div>

            <div className="mb-6 rounded-xl p-0">
              <h3 className="mb-4 text-2xl font-medium text-white">Overview:</h3>
              <p className="m-0 text-[20px] font-normal leading-relaxed text-white/85">
                {workshop.description}
              </p>
            </div>

            <div className="mb-6 rounded-xl p-0">
              <h3 className="mb-4 text-2xl font-medium text-white">Agenda:</h3>
              <div className="grid gap-6">
                {workshop.agenda.split(",").map((item, index) => (
                  <div key={index} className="">
                    <p className="m-0 text-[20px] font-normal leading-[22px] text-white/85">
                      {index + 1}. {item.trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckInModal isOpen={isCheckInModalOpen} onClose={() => setIsCheckInModalOpen(false)} scheduleId={scheduleId} />
      {showAttendeeModal && (
        <AttendeeModal isOpen={showAttendeeModal} onClose={() => setShowAttendeeModal(false)} scheduleId={scheduleId} workshopStatus={workshop?.schedules?.[0]?.status} />
      )}
    </div>
  );
};

export default WorkshpCard;

