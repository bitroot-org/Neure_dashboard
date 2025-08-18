import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Spin, Alert } from "antd";
import CustomCalendar from "../../components/CustomCalendar";
import PresentationSlide from "../../components/PresentationSlide";
import CustomHeader from "../../components/CustomHeader";
import CustomPagination from "../../components/CustomPagination";
import { getWorkshops, getWorkshopDates } from "../../services/api";

const EventDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [workshops, setWorkshops] = useState([]);
  const [dates, setDates] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [workshopRes, datesRes] = await Promise.all([
          getWorkshops({ currentPage }),
          getWorkshopDates(),
        ]);

        if (workshopRes.status) {
          setWorkshops(workshopRes.data.workshops);
          setTotalPages(workshopRes.data.pagination.totalPages);
        }
        if (datesRes.status) setDates(datesRes.data);
        setError(null);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  return (
    <div className="min-h-screen px-5 sm:px-10 lg:px-20 py-10">
      <CustomHeader title="Workshops" />

      {error && <Alert message={error} type="error" className="mb-6" showIcon />}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="rounded-xl border border-white/10 bg-[#191A20] p-4">
            <PresentationSlide slides={workshops} loading={loading} />
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div className="rounded-xl border border-white/10 bg-[#191A20] p-4">
            <CustomCalendar dates={dates} loading={loading} />
          </div>
        </Col>
      </Row>

      {!loading && (
        <div className="mt-8">
          <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default EventDashboard;

