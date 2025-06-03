import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import MetricLineChart from "../../components/MetricLineCharts";
import CustomHeader from "../../components/CustomHeader";
import { getStressTrends } from "../../services/api";
import "./index.css";

const WellbeingIndex = () => {
  const [loading, setLoading] = useState(true);
  const [stressTrends, setStressTrends] = useState([]);
  const [period, setPeriod] = useState("monthly");
  
  const getDateRange = (periodType) => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch(periodType) {
      case "weekly":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "quarterly":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "yearly":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const fetchStressTrends = async (periodType = "monthly") => {
    try {
      setLoading(true);
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        message.error("Company ID not found");
        return;
      }

      const { startDate, endDate } = getDateRange(periodType);
      
      const response = await getStressTrends(companyId, startDate, endDate);
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

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchStressTrends(newPeriod);
  };

  useEffect(() => {
    fetchStressTrends(period);
  }, []);

  return (
    <div className="wellbeing-container">
      <CustomHeader title="Company Well-being Index" showBackButton={true} />
      <MetricLineChart 
        data={stressTrends} 
        loading={loading} 
        period={period}
        onPeriodChange={handlePeriodChange}
      />
    </div>
  );
};

export default WellbeingIndex;
