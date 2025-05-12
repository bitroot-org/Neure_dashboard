import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { message, Spin, Tooltip } from "antd";
import { getWorkshopAttendees } from "../../services/api";
import CustomPagination from "../CustomPagination";
import "./index.css";

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
    <div className="attendee-modal-overlay">
      <div className="attendee-modal">
        <div className="attendee-modal-header">
          <div>
            <h2>Attendees</h2>{" "}
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
                className={`download-csv ${
                  !isWorkshopCompleted ? "disabled" : ""
                }`}
                onClick={handleDownloadCSV}
                disabled={downloadingCSV || !isWorkshopCompleted}
              >
                {downloadingCSV ? "Downloading..." : "Download CSV"}
              </button>
            </Tooltip>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="attendee-tabs">
          <button
            className={`tab ${activeTab === "total" ? "active" : ""}`}
            onClick={() => setActiveTab("total")}
          >
            Total RSVP ({pagination.total})
          </button>
          <button
            className={`tab ${activeTab === "checkedIn" ? "active" : ""}`}
            onClick={() => setActiveTab("checkedIn")}
          >
            Checked-in ({attendees.checkedIn.length})
          </button>
          <button
            className={`tab ${activeTab === "notCheckedIn" ? "active" : ""}`}
            onClick={() => setActiveTab("notCheckedIn")}
          >
            Not checked-in ({attendees.notCheckedIn.length})
          </button>
        </div>

        <div className="attendee-list">
          {loading ? (
            <div className="loading-state">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Sr no.</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Ticket Code</th>
                  </tr>
                </thead>
                <tbody>
                  {getDisplayData().map((attendee, index) => (
                    <tr key={attendee.ticket_code}>
                      <td>{index + 1}</td>
                      <td>{`${attendee.first_name} ${attendee.last_name}`}</td>
                      <td>{attendee.email}</td>
                      <td>{attendee.ticket_code}</td>
                    </tr>
                  ))}
                  {getDisplayData().length === 0 && (
                    <tr>
                      <td
                        colSpan={activeTab === "checkedIn" ? 5 : 4}
                        className="no-data"
                      >
                        No attendees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {pagination.totalPages > 1 && (
                <div className="pagination-container">
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
