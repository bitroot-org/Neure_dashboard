import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { message, Spin, Tooltip } from "antd";
import { getWorkshopAttendees } from "../services/api";
import CustomPagination from "./CustomPagination";

const AttendeeModal = ({ isOpen, onClose, scheduleId, workshopStatus }) => {
  const { workshopId } = useParams();
  const [activeTab, setActiveTab] = useState("total");
  const [loading, setLoading] = useState(false);
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [attendees, setAttendees] = useState({
    total: [],
    checkedIn: [],
    notCheckedIn: [],
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });
  const [workshopTitle, setWorkshopTitle] = useState("");

  // Check if workshop is completed
  const isWorkshopCompleted = workshopStatus === "completed";

  // Add a useEffect to log the scheduleId when it changes
  useEffect(() => {
    console.log("AttendeeModal received scheduleId:", scheduleId);
  }, [scheduleId]);

  useEffect(() => {
    if (isOpen && workshopId) {
      fetchAttendees(1);
    }
  }, [isOpen, workshopId, scheduleId, activeTab]);

  const fetchAttendees = async (page = 1) => {
    try {
      setLoading(true);
      const companyId = localStorage.getItem("companyId");

      if (!companyId) {
        throw new Error("Company ID not found");
      }

      // Check if scheduleId is defined and log it
      console.log("Using scheduleId for API call:", scheduleId);
      
      if (!scheduleId) {
        console.error("scheduleId is undefined or null");
        message.error("Schedule ID is missing. Cannot fetch attendees.");
        setLoading(false);
        return;
      }

      // Add pagination parameters
      const params = {
        company_id: companyId,
        schedule_id: scheduleId,
        page: page,
        limit: pagination.limit,
        status:
          activeTab === "checkedIn"
            ? 1
            : activeTab === "notCheckedIn"
            ? 0
            : undefined,
      };

      // Log the full params object
      console.log("API call params:", params);

      const response = await getWorkshopAttendees(
        workshopId,
        companyId,
        scheduleId,
        params
      );

      if (response.status) {
        const allAttendees = response.data || [];

        // Save workshop title if available
        if (allAttendees.length > 0) {
          setWorkshopTitle(allAttendees[0].workshop_title);
        }

        // Update pagination information from response
        if (response.pagination) {
          setPagination({
            currentPage: response.pagination.currentPage,
            totalPages: response.pagination.totalPages,
            total: response.pagination.total,
            limit: response.pagination.limit,
          });
        }

        // If we're filtering by tab on the server, just use the returned data
        if (activeTab === "checkedIn" || activeTab === "notCheckedIn") {
          setAttendees({
            ...attendees,
            [activeTab]: allAttendees,
          });
        } else {
          // For 'total' tab or if server doesn't support filtering
          // Separate attendees based on is_attended status
          const checkedIn = allAttendees.filter((a) => a.is_attended === 1);
          const notCheckedIn = allAttendees.filter((a) => a.is_attended === 0);

          setAttendees({
            total: allAttendees,
            checkedIn,
            notCheckedIn,
          });
        }
      } else {
        message.error(response.message || "Failed to fetch attendees");
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
      message.error("Failed to fetch attendees");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchAttendees(page);
  };

  const handleDownloadCSV = async () => {
    // Only allow download if workshop is completed
    if (!isWorkshopCompleted) {
      message.info(
        "CSV download will be available after the workshop is completed"
      );
      return;
    }

    try {
      setDownloadingCSV(true);
      const companyId = localStorage.getItem("companyId");

      if (!companyId) {
        throw new Error("Company ID not found");
      }

      // Request all data without pagination for CSV download
      const params = {
        company_id: companyId,
        schedule_id: scheduleId,
        all: true,
        status:
          activeTab === "checkedIn"
            ? 1
            : activeTab === "notCheckedIn"
            ? 0
            : undefined,
      };

      const response = await getWorkshopAttendees(
        workshopId,
        companyId,
        scheduleId,
        params
      );

      if (response.status && response.data) {
        // Convert data to CSV
        const csvData = convertToCSV(response.data);

        // Create a blob and download it
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `workshop-attendees-${workshopId}-${activeTab}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        message.error(response.message || "Failed to download attendees data");
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
      message.error("Failed to download CSV");
    } finally {
      setDownloadingCSV(false);
    }
  };

  // Helper function to convert data to CSV format
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    // Define CSV headers based on data properties
    const headers = [
      "Sr No.",
      "Full Name",
      "Email",
      "Ticket Code",
      "Attendance Status",
      activeTab === "checkedIn" ? "Check-in Time" : "",
    ]
      .filter(Boolean)
      .join(",");

    // Convert each attendee to a CSV row
    const rows = data.map((attendee, index) => {
      const values = [
        index + 1,
        `${attendee.first_name} ${attendee.last_name}`,
        attendee.email,
        attendee.ticket_code,
        attendee.is_attended === 1 ? "Checked In" : "Not Checked In",
        activeTab === "checkedIn" ? attendee.updated_at || "" : "",
      ].filter((_, i) => i < 5 || activeTab === "checkedIn");

      // Escape values that contain commas
      return values
        .map((value) => {
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        })
        .join(",");
    });

    return [headers, ...rows].join("\n");
  };

  const getDisplayData = () => {
    switch (activeTab) {
      case "checkedIn":
        return attendees.checkedIn;
      case "notCheckedIn":
        return attendees.notCheckedIn;
      default:
        return attendees.total;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center z-[1000] backdrop-blur-[6px]">
      <div className="bg-[#0d0d11] rounded-[20px] w-[90%] max-w-[700px] max-h-[80vh] flex flex-col shadow-[0px_14px_8px_-10px_#403e3e66]">
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <div>
            <h2 className="font-medium text-2xl leading-none text-white">Attendees</h2>
          </div>
          <div>
            <Tooltip
              title={
                !isWorkshopCompleted
                  ? "CSV download will be available after the workshop is completed"
                  : ""
              }
            >
              <button
                className={`bg-gradient-to-b from-white to-[#797B87] text-black border-none rounded-[70px] px-4 py-2 mr-4 cursor-pointer font-medium h-12 transition-colors hover:bg-[#3CB954] disabled:bg-[#A8E9B5] disabled:cursor-not-allowed ${
                  !isWorkshopCompleted ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={handleDownloadCSV}
                disabled={downloadingCSV || !isWorkshopCompleted}
              >
                {downloadingCSV ? "Downloading..." : "Download CSV"}
              </button>
            </Tooltip>
            <button className="bg-none border-none text-white text-[32px] cursor-pointer p-0 leading-none self-center" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="flex px-6 pt-4 pb-0 gap-4 border-b border-white/10">
          <button
            className={`bg-none border-none text-white/60 px-4 py-2 cursor-pointer text-base font-medium ${
              activeTab === "total" ? "text-white border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("total")}
          >
            Total RSVP ({pagination.total})
          </button>
          <button
            className={`bg-none border-none text-white/60 px-4 py-2 cursor-pointer text-base font-medium ${
              activeTab === "checkedIn" ? "text-white border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("checkedIn")}
          >
            Checked-in ({attendees.checkedIn.length})
          </button>
          <button
            className={`bg-none border-none text-white/60 px-4 py-2 cursor-pointer text-base font-medium ${
              activeTab === "notCheckedIn" ? "text-white border-b-2 border-white" : ""
            }`}
            onClick={() => setActiveTab("notCheckedIn")}
          >
            Not checked-in ({attendees.notCheckedIn.length})
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-[#191a20] m-5 rounded-2xl">
          {loading ? (
            <div className="flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-left text-white/60 font-normal border-b border-white/10">Sr no.</th>
                    <th className="p-3 text-left text-white/60 font-normal border-b border-white/10">Full Name</th>
                    <th className="p-3 text-left text-white/60 font-normal border-b border-white/10">Email</th>
                    <th className="p-3 text-left text-white/60 font-normal border-b border-white/10">Ticket Code</th>
                  </tr>
                </thead>
                <tbody>
                  {getDisplayData().map((attendee, index) => (
                    <tr key={attendee.ticket_code}>
                      <td className="p-3 text-left text-white border-b border-white/10">{index + 1}</td>
                      <td className="p-3 text-left text-white border-b border-white/10">{`${attendee.first_name} ${attendee.last_name}`}</td>
                      <td className="p-3 text-left text-white border-b border-white/10">{attendee.email}</td>
                      <td className="p-3 text-left text-white border-b border-white/10">{attendee.ticket_code}</td>
                    </tr>
                  ))}
                  {getDisplayData().length === 0 && (
                    <tr>
                      <td
                        colSpan={activeTab === "checkedIn" ? 5 : 4}
                        className="p-3 text-white border-b border-white/10 text-center"
                      >
                        No attendees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {pagination.totalPages > 1 && (
                <div className="mt-5 flex justify-center">
                  <CustomPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeModal;
