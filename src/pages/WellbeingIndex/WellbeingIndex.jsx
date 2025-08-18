import React, { useState, useEffect } from "react";
import { message } from "antd";
import MetricLineChart from "../../components/MetricLineCharts";
import CustomHeader from "../../components/CustomHeader";
import { getCompanyWellbeingTrends, getStressTrends } from "../../services/api";

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
    switch (periodType) {
      case "weekly": startDate.setDate(endDate.getDate() - 7); break;
      case "monthly": startDate.setMonth(endDate.getMonth() - 1); break;
      case "quarterly": startDate.setMonth(endDate.getMonth() - 3); break;
      case "yearly": startDate.setFullYear(endDate.getFullYear() - 1); break;
      default: startDate.setMonth(endDate.getMonth() - 1);
    }
    return { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] };
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
      const day = date.getDate();
      return `${month} ${day}`;
    } catch {
      return "Error";
    }
  };

  const fetchWellbeingTrends = async (periodType = "monthly") => {
    try {
      setWellbeingLoading(true);
      const companyId = localStorage.getItem("companyId");
      if (!companyId) { message.error("Company ID not found"); return; }
      const { startDate, endDate } = getDateRange(periodType);
      const response = await getCompanyWellbeingTrends(companyId, startDate, endDate);
      if (response.status) {
        setWellbeingTrends(response.data.trends.map((t) => ({ date: formatDate(t.period), value: t.wellbeing_score })));
      }
    } catch (e) {
      console.error("Error fetching wellbeing trends:", e);
      message.error("Failed to fetch wellbeing trends");
    } finally { setWellbeingLoading(false); }
  };

  const fetchStressTrends = async (periodType = "monthly") => {
    try {
      setStressLoading(true);
      const companyId = localStorage.getItem("companyId");
      if (!companyId) { message.error("Company ID not found"); return; }
      const { startDate, endDate } = getDateRange(periodType);
      const response = await getStressTrends(companyId, startDate, endDate);
      if (response.status) {
        const transformed = response.data.trends.map((trend) => {
          const d = new Date(trend.period);
          const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
          const day = d.getDate();
          return { date: `${month} ${day}`, value: trend.stress_level };
        });
        setStressTrends(transformed);
      }
    } catch (e) {
      console.error("Error fetching stress trends:", e);
      message.error("Failed to fetch stress trends");
    } finally { setStressLoading(false); }
  };

  useEffect(() => {
    fetchWellbeingTrends(wellbeingPeriod);
    fetchStressTrends(stressPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen px-5 sm:px-10 lg:px-20 py-10 overflow-y-auto">
      <CustomHeader title="Company Well-being Index" showBackButton />
      <div className="flex w-full flex-col gap-8 mb-5 flex-1">
        <div className="min-h-[300px] w-full">
          <MetricLineChart
            data={wellbeingTrends}
            loading={wellbeingLoading}
            period={wellbeingPeriod}
            onPeriodChange={(p) => { setWellbeingPeriod(p); fetchWellbeingTrends(p); }}
            title="Company Well-being Index"
            lineColor="#10B981"
          />
        </div>
        <div className="min-h-[300px] w-full">
          <MetricLineChart
            data={stressTrends}
            loading={stressLoading}
            period={stressPeriod}
            onPeriodChange={(p) => { setStressPeriod(p); fetchStressTrends(p); }}
            title="Company Stress Levels"
            lineColor="#EF4444"
          />
        </div>
      </div>
    </div>
  );
};

export default WellbeingIndex;

