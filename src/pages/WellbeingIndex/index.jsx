import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import MetricLineChart from "../../components/MetricLineCharts";
import CustomHeader from "../../components/CustomHeader";
import { getCompanyWellbeingTrends, getStressTrends } from "../../services/api";
import "./index.css";

const WellbeingIndex = () => {
  const [wellbeingLoading, setWellbeingLoading] = useState(true);
  const [stressLoading, setStressLoading] = useState(true);
  const [wellbeingTrends, setWellbeingTrends] = useState([]);
  const [stressTrends, setStressTrends] = useState([]);
  const [wellbeingPeriod, setWellbeingPeriod] = useState("monthly");
  const [stressPeriod, setStressPeriod] = useState("monthly");
  
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

  const fetchWellbeingTrends = async (periodType = "monthly") => {
    try {
      setWellbeingLoading(true);
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        message.error("Company ID not found");
        return;
      }

      const { startDate, endDate } = getDateRange(periodType);
      
      const response = await getCompanyWellbeingTrends(companyId, startDate, endDate);
      if (response.status) {
        const transformedData = response.data.trends.map((trend) => ({
          date: formatDate(trend.period), // Use the same formatting function
          value: trend.wellbeing_score,
        }));
        setWellbeingTrends(transformedData);
      }
    } catch (error) {
      console.error("Error fetching wellbeing trends:", error);
      message.error("Failed to fetch wellbeing trends");
    } finally {
      setWellbeingLoading(false);
    }
  };

  const fetchStressTrends = async (periodType = "monthly") => {
    try {
      setStressLoading(true);
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        message.error("Company ID not found");
        return;
      }

      const { startDate, endDate } = getDateRange(periodType);
      
      const response = await getStressTrends(companyId, startDate, endDate);
      if (response.status) {
        // Simplify the date format to ensure it works with the chart
        const transformedData = response.data.trends.map((trend) => {
          const date = new Date(trend.period);
          // Format as simple string like "MAY 10" or "JUN 02"
          const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
          const day = date.getDate();
          
          return {
            date: `${month} ${day}`,
            value: trend.stress_level,
          };
        });
        
        console.log("Transformed stress data:", transformedData);
        setStressTrends(transformedData);
      }
    } catch (error) {
      console.error("Error fetching stress trends:", error);
      message.error("Failed to fetch stress trends");
    } finally {
      setStressLoading(false);
    }
  };

  const handleWellbeingPeriodChange = (newPeriod) => {
    setWellbeingPeriod(newPeriod);
    fetchWellbeingTrends(newPeriod);
  };

  const handleStressPeriodChange = (newPeriod) => {
    setStressPeriod(newPeriod);
    fetchStressTrends(newPeriod);
  };

  useEffect(() => {
    fetchWellbeingTrends(wellbeingPeriod);
    fetchStressTrends(stressPeriod);
  }, []);

  useEffect(() => {
    console.log("Current stress trends data:", stressTrends);
  }, [stressTrends]);

  return (
    <div className="wellbeing-container">
      <CustomHeader title="Company Well-being Index" showBackButton={true} />
      
      {/* {stressTrends.length > 0 && (
        <div style={{ marginBottom: '20px', color: 'white' }}>
          <p>Debug - First data point: {JSON.stringify(stressTrends[0])}</p>
        </div>
      )} */}
      
      <div className="charts-container">
        <div className="chart-wrapper">
          <MetricLineChart 
            data={wellbeingTrends} 
            loading={wellbeingLoading} 
            period={wellbeingPeriod}
            onPeriodChange={handleWellbeingPeriodChange}
            title="Company Well-being Index"
            lineColor="#10B981" // Green color for wellbeing
          />
        </div>
        
        <div className="chart-wrapper">
          <MetricLineChart 
            data={stressTrends} 
            loading={stressLoading} 
            period={stressPeriod}
            onPeriodChange={handleStressPeriodChange}
            title="Company Stress Levels"
            lineColor="#EF4444" // Red color for stress
          />
        </div>
      </div>
    </div>
  );
};

export default WellbeingIndex;

// Updated date formatting function
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return `${month} ${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
};
