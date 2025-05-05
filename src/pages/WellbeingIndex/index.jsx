import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import MetricLineChart from "../../components/MetricLineCharts";
import CustomHeader from "../../components/CustomHeader";
import { getStressTrends } from "../../services/api";
import "./index.css";

const WellbeingIndex = () => {
  const [loading, setLoading] = useState(true);
  const [stressTrends, setStressTrends] = useState([]);

  const fetchStressTrends = async () => {
    try {
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        message.error("Company ID not found");
        return;
      }

      const response = await getStressTrends(companyId);
      if (response.status) {
        const transformedData = response.data.trends.map((trend) => ({
          date: trend.period.substring(0, 7), // Format: "2024-05"
          value: trend.stress_level,
        }));
        setStressTrends(transformedData);
      }
    } catch (error) {
      console.error("Error fetching stress trends:", error);
      message.error("Failed to fetch stress trends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStressTrends();
  }, []);

  return (
    <div className="wellbeing-container">
      <CustomHeader title="Company Well-being Index" showBackButton={true} />
      <MetricLineChart data={stressTrends} loading={loading} />
    </div>
  );
};

export default WellbeingIndex;
